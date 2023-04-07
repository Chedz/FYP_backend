import os
import sys 
from datetime import datetime
import yaml


# datetime.now().strftime("%Y_%m_%d-%I_%M_%S_%p")
# os.path.exists("file.txt") # Or folder, will return true or false

def sensorFusionToPoints(fileName):
    print('called sensorFusionToPoints()')

    # check that file does not exist in processedData folder
    if(checkFileExists("processedData/1d_0_" + fileName)):
        print("File already exists in processedData folder")
    elif(checkFileExists("processedData/1d_1_" + fileName)):
        print("File already exists in processedData folder")
        return
    else:
        print("File does not exist in processedData folder")
        # create empty file in processedData folder
        open("processedData/1d_" + fileName, 'w').close() 

    with open("inputData/" + fileName) as file_in:
        averageElevation = 0
        averageCounter = 0
        lines = []
        points = []
        for line in file_in:
            #lines.append(line)
            #print(type(line))
            pointsStr = line.split(",")

            averageElevation += float(pointsStr[2]) 
            averageCounter += 1
            # print(pointsStr)
            points.append([float(pointsStr[0]), float(pointsStr[1]), float(pointsStr[2]) - (float(pointsStr[3]) * 0.01) ]) # x, z, y
            points.append([float(pointsStr[0]), float(pointsStr[1]), float(pointsStr[2]) + (float(pointsStr[4]) * 0.01) ])

            with open("processedData/1d_0_" + fileName, "a") as file_out:
                #verticeString = 
                if(float(pointsStr[3]) != -1.0):
                    file_out.write(pointsStr[0] + " , " +  str(float(pointsStr[2]) - (float(pointsStr[3]) * 0.01) ) + " , " + pointsStr[1] + "\n" )
            with open("processedData/1d_1_" + fileName, "a") as file_out:
                if(float(pointsStr[4]) != -1.0):
                    file_out.write(pointsStr[0] + " , " +  str(float(pointsStr[2]) + (float(pointsStr[4]) * 0.01) ) + " , " + pointsStr[1] + "\n" )

        # open yaml file and append data to it 
        fileName = fileName.split(".")[0] # remove .txt from filename

        averageElevation = averageElevation / averageCounter

        # open corresponding 2d processed file


        with open("inputData/" + fileName + '.yaml','r') as yamlfile:
            cur_yaml = yaml.safe_load(yamlfile) # Note the safe_load
            #cur_yaml['bugs_tree'].update(new_yaml_data_dict)
            cur_yaml['averageElevation'] = averageElevation

        if cur_yaml:
            with open("inputData/" + fileName + '.yaml','w') as yamlfile:
                yaml.safe_dump(cur_yaml, yamlfile) # Also note the safe_dump
            print(open("inputData/" + fileName + '.yaml').read())


# print(open('names.yaml').read())

def checkFileExists(fileNamePath):
    if os.path.exists(fileNamePath):
        print("File exists in " + fileNamePath)
        return True
    else:
        print("File does not exist in " + fileNamePath)
        return False
    
def main(fileName):
    # check if file exists in inputData folder
    if(checkFileExists("inputData/" +fileName)):
        sensorFusionToPoints(fileName) # call function with filename if file exists
        print("Succesfully processed " + fileName + " and wrote to 1d_" + fileName + " in processedData folder.")
    
    else:
        print("File does not exist in inputData folder, exiting...")
        sys.exit(1)

if __name__ == '__main__':
    # check if argument is passed
    if len(sys.argv) != 2:
        print("Usage: python3 sensorFusionToPoints.py <filename>")
        sys.exit(1)

    main(sys.argv[1])
