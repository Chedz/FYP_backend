import pgmTo2dPoints, sensorFusionToPoints
import sys

if __name__ == '__main__':
    # main.py executed as script

    # check if command line argument is given and correct number of arguments
    if len(sys.argv) != 2:
        print("Usage: python3 scripts/main.py <filename>")
        sys.exit(1)
    
    fileName = sys.argv[1] # get filename from command line argument

    # sequential execution
    pgmTo2dPoints.main(fileName + ".pgm")
    sensorFusionToPoints.main(fileName + ".txt")