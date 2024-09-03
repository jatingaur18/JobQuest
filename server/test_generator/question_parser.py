f = open(r"JobQuest\test_generator\Sample\Sample ques3.txt", "r")
text = f.read()
# print(text)
list = text.split("!@#ques")
print("\n\n")

# separator = 
Q_list = []
for a in list:
    list_element = []
    if(len(a.split("!@#opt"))!=1):
        
        #splitting the string into question part and option part
        try:
            part_q, part_opt = a.split("!@#opt")
        except:
            print("no questions")
            continue
        # #temp
        print("Ques:",part_q)

        #spiting into q_no and question
        try:
            q_no, question = int(part_q.partition("\n")[0].strip()), part_q.partition("\n")[2] #converting q_no to string
        except:
            # print(part_q.partition("\n"))
            print("unable to fetch question !")
            continue

        list_element.append(q_no)
        list_element.append(question)

        # print(part_opt.split("!@#ans"))
        #splitting option part into options and answer
        try:
            option_string, ans_string = part_opt.split("!@#ans")
            option_list = option_string.split("\n")
            # print(option_list)
        except:
            print("no options")
            continue

        #convertion options to dict
        options_dict = {}
        for b in option_list:
            if(len(b)>1):
                option = b[0]
                value = b[2:]
                options_dict[option] = value
        
        list_element.append(options_dict)
                
        #storing answer as string
        answer = ans_string[1]
        list_element.append(answer)
        print()

        print(list_element)
        list_element.append(Q_list)

# print(Q_list)
# Q_List structure [[qno,'ques',{option},{ans}]]
