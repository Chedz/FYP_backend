import os
import sys

def read_pgm(pgmf):
    """Return a raster of integers from a PGM as a list of lists."""
    global knownSpacePoints
    # string = pgmf.readline()
    # print(string)
    assert pgmf.readline().decode('utf-8') == 'P5\n'
    comment = pgmf.readline().decode('utf-8')
    (width, height) = [int(i) for i in pgmf.readline().decode('utf-8').split()]
    depth = int(pgmf.readline().decode('utf-8'))
    assert depth <= 255

    raster = []
    knownSpacePoints = []
    for i in range(height):
        # print(y)
        row = []
        for j in range(width):
            value = ord(pgmf.read(1))
            # print(value)
            if value != 205: #205 is the value of the unknown space
                knownSpacePoints.append([value, i, j])
            row.append(value)
            # row.append(ord(pgmf.read(1)))
        raster.append(row)
    # print(len(knownSpacePoints))
    # print(len(raster))
    return 

def writePointsToFile(outputfileName):
    with open('processedData/2d_' + outputfileName, 'w') as file:
        for point in knownSpacePoints:
            file.write(str(point[0]) + ' ' + str(point[1]*0.050) + ' ' + str(point[2]*0.050) + '\n') #0.05 from comment in file header

# writePointsToFile()

def checkFileExists(fileNamePath):
    if os.path.exists(fileNamePath):
        print("File exists in " + fileNamePath)
        return True
    else:
        print("File does not exist in " + fileNamePath)
        return False

def main(fileName):
    # print('called main()')

    # check if file exists in inputData folder
    if(checkFileExists("inputData/" + fileName)):
        # sensorFusionToPoints(sys.argv[1]) # call function with filename if file exists
        read_pgm(open('inputData/' + fileName, 'rb'))
        writePointsToFile(fileName)
        print("Succesfully processed " + fileName + " and wrote to 2d_" + fileName + " in processedData folder.")

    else:
        print("File does not exist in inputData folder, exiting...")
        sys.exit(1)


if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("Usage: python3 pgmTo2dPoints.py <filename.pgm>")
        sys.exit(1)

    main(sys.argv[1])

    # # check if file exists in inputData folder
    # if(checkFileExists("inputData/" +sys.argv[1])):
    #     # sensorFusionToPoints(sys.argv[1]) # call function with filename if file exists
    #     main(sys.argv[1])


# f = open('mapTest.pgm', 'rb')
# msg = f.readline()
# print(msg.decode('utf-8'))
# f.close()

