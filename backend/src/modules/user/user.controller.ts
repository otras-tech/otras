import { Controller, Get, Param, ParseIntPipe, NotFoundException, Patch, Delete, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { ResultService } from '../result/result.service';
import { MockTestService } from '../mock-test/mock-test.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly resultService: ResultService,
        private readonly mockTestService: MockTestService,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Find all users (Admin only)' })
    @ApiResponse({ status: 200, description: 'List of all users' })
    async findAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiResponse({ status: 200, description: 'User record' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.userService.findById(id);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @Get(':id/dashboard')
    @ApiOperation({ summary: 'Get unified dashboard data (Results + Mock Attempts)' })
    @ApiResponse({ status: 200, description: 'Aggregated dashboard statistics' })
    async getDashboardData(@Param('id', ParseIntPipe) id: number) {
        const user = await this.userService.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const results = await this.resultService.getUserResults(id);
        const mockAttempts = await this.mockTestService.getUserMockAttempts(user.otrId);

        // Normalize and merge both types of attempts for a unified history
        const mergedAttempts = [
            ...results.map(r => {
                const totalQs = (r as any).test?._count?.questions || 1;
                return {
                    id: `res_${r.id}`,
                    score: r.score,
                    percentage: Math.min(Math.round((r.score / totalQs) * 100), 100),
                    createdAt: r.createdAt,
                    testName: (r as any).test?.name || 'Artha Assessment',
                    type: 'artha',
                    subjectBreakdown: (r as any).subjectBreakdown
                };
            }),
            ...mockAttempts.map(m => ({
                id: `mock_${m.id}`,
                score: m.score,
                percentage: m.totalMarks > 0
                    ? (m.correctAnswers != null
                        ? Math.min(Math.round((m.correctAnswers / m.totalMarks) * 100), 100)
                        : Math.max(0, Math.min(Math.round((m.score / m.totalMarks) * 100), 100)))
                    : 0,
                createdAt: m.attemptedAt,
                testName: (m as any).mockTest?.title || 'Official Mock Test',
                type: 'mock',
                subjectBreakdown: m.subjectBreakdown
            }))
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // Prefer ARTHA percentile as the Career Index if available
        const arthaProfile = await this.userService.getArthaProfile(id.toString());
        let readinessIndex = 0;

        if (arthaProfile && (arthaProfile as any).readinessIndex > 0) {
            readinessIndex = Math.round((arthaProfile as any).readinessIndex);
        } else if (arthaProfile && arthaProfile.percentile > 0) {
            readinessIndex = Math.round(arthaProfile.percentile);
        } else {
            // Fallback: score-based calculation
            const latestAttempt = mergedAttempts[0];
            readinessIndex = latestAttempt ? latestAttempt.percentage : 0;
        }

        return {
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                otrId: user.otrId,
                email: user.email,
            },
            stats: {
                readinessIndex,
                testsCompleted: mergedAttempts.length,
                recentTend: mergedAttempts.slice(0, 7).reverse().map(r => r.percentage),
                percentile: arthaProfile?.percentile || 0,
                logicalScore: arthaProfile?.logicalScore || 0,
                quantScore: arthaProfile?.quantScore || 0,
                verbalScore: arthaProfile?.verbalScore || 0,
            },
            mockTests: mergedAttempts.map(a => ({
                score: a.percentage, // Use percentage for the graph
                createdAt: a.createdAt,
                subjectBreakdown: (a as any).subjectBreakdown
            })),
            recentResults: mergedAttempts.slice(0, 3).map(a => ({
                id: a.id,
                score: a.score,
                percentage: a.percentage,
                createdAt: a.createdAt,
                test: { name: a.testName } // Match frontend expected shape
            }))
        };
    }

    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
        return this.userService.update(id, data);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.userService.remove(id);
    }

    @Get(':id/tier-status')
    async getTierStatus(@Param('id', ParseIntPipe) id: number) {
        return this.userService.getTierStatus(id);
    }
}
