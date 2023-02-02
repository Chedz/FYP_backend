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

def writePointsToFile():
    with open('output/2d_Points.txt', 'w') as file:
        for point in knownSpacePoints:
            file.write(str(point[0]) + ' ' + str(point[1]*0.050) + ' ' + str(point[2]*0.050) + '\n') #0.05 from comment in file header

# writePointsToFile()

def main():
    # print('called main()')
    read_pgm(open('inputData/limMap2.pgm', 'rb'))
    writePointsToFile()
    # print('done')
    # for i in range(5000):
    #     print("pgmTo2dPoint: " + str(i))

if __name__ == '__main__':
    main()


# f = open('mapTest.pgm', 'rb')
# msg = f.readline()
# print(msg.decode('utf-8'))
# f.close()

