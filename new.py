provider = input("Which password do you want.\n")
dic = {"facebook":"abcdca","google":"987452155","instagram":"964260"}
if provider.lower() in dic.keys(): 
    print("Your ",provider.lower()," password is ",dic[provider.lower()])
else :
    print("Not available")