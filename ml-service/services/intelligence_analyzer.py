def analyze_profile(logical, quant, verbal): 
profile={} 
if logical>80: 
profile["strength"]="analytical" 
if quant>75: 
profile["career"]="data science" 
if verbal>80: 
profile["career"]="management" 
return profile 