def calculate_percentile(score, total_questions):
    """
    Robust deterministic percentile calculation with detailed traceability.
    
    Formula:
    percentile = (score / total_questions) * 100
    """
    print("\n---- Percentile Calculation Start ----")
    print(f"ML-SERVICE: Received Score: {score}")
    print(f"ML-SERVICE: Total Questions: {total_questions}")

    try:
        # Convert inputs to float to ensure precision
        score = float(score)
        total_questions = float(total_questions)
    except (ValueError, TypeError) as e:
        print(f"ML-SERVICE ERROR: Invalid input types. Score={score}, TotalQuestions={total_questions}")
        print("---- Percentile Calculation End (FAIL) ----\n")
        return 0.0

    if total_questions <= 0:
        print(f"ML-SERVICE ERROR: total_questions is {total_questions}. Division by zero avoided. Returning 0 percentile.")
        print("---- Percentile Calculation End (FAIL) ----\n")
        return 0.0
        
    average = score / total_questions
    print(f"ML-SERVICE: Average Score Ratio (score/total): {average}")

    percentile = average * 100
    print(f"ML-SERVICE: Raw Calculated Percentile: {percentile}")
    
    # Ensure percentile stays within 0-100 range
    final_percentile = max(0.0, min(100.0, round(float(percentile), 2)))
    print(f"ML-SERVICE: Final Rounded Percentile: {final_percentile}")
    
    print("---- Percentile Calculation End (SUCCESS) ----\n")
    return final_percentile

if __name__ == "__main__":
    # Support for direct CLI invocation (subprocess call)
    import sys
    try:
        if len(sys.argv) > 2:
            score = sys.argv[1]
            total_questions = sys.argv[2]
            calculate_percentile(score, total_questions)
        else:
            print("Usage: python percentile_calculator.py <score> <total_questions>")
    except Exception as e:
        print(f"CLI Execution failed: {str(e)}")
        sys.exit(1)
