import os
import sys 
from datetime import datetime

# datetime.now().strftime("%Y_%m_%d-%I_%M_%S_%p")
# os.path.exists("file.txt") # Or folder, will return true or false

def sensorFusionToPoints(fileName):
    print('called sensorFusionToPoints()')

    # check that file does not exist in output folder
    if(checkFileExists("output/1d_" + fileName)):
        print("File already exists in output folder")
        return
    else:
        print("File does not exist in output folder")
        # create empty file in output folder
        open("output/1d_" + fileName, 'w').close() 

    with open("inputData/" + fileName) as file_in:
        lines = []
        points = []
        for line in file_in:
            #lines.append(line)
            #print(type(line))
            pointsStr = line.split(",")
            # print(pointsStr)
            points.append([float(pointsStr[0]), float(pointsStr[1]), float(pointsStr[2]) - (float(pointsStr[3]) * 0.01) ])
            points.append([float(pointsStr[0]), float(pointsStr[1]), float(pointsStr[2]) + (float(pointsStr[4]) * 0.01) ])

            with open("output/1d_" + fileName, "a") as file_out:
                #verticeString = 
                file_out.write(pointsStr[0] + " , " +  str(float(pointsStr[2]) - (float(pointsStr[3]) * 0.01) ) + " , " + pointsStr[1] + "\n" )
                file_out.write(pointsStr[0] + " , " +  str(float(pointsStr[2]) + (float(pointsStr[4]) * 0.01) ) + " , " + pointsStr[1] + "\n" )
                

def testCall():
    print('called testCall()')
    for i in range(5000):
        print("sensorFusionToPoints: " + str(i))

def main():
    # testCall()
    print('called main()')
    sensorFusionToPoints()
    print('done')


def checkFileExists(fileNamePath):
    if os.path.exists(fileNamePath):
        print("File exists in " + fileNamePath)
        return True
    else:
        print("File does not exist in " + fileNamePath)
        return False

if __name__ == '__main__':
    # main()
    # check if argument is passed
    if len(sys.argv) != 2:
        print("Usage: python sensorFusionToPoints.py <filename>")
        sys.exit(1)

    # check if file exists in inputData folder
    if(checkFileExists("inputData/" +sys.argv[1])):
        sensorFusionToPoints(sys.argv[1]) # call function with filename if file exists