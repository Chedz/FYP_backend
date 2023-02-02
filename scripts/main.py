import pgmTo2dPoints, sensorFusionToPoints

def service_func():
    print('service func')

if __name__ == '__main__':
    # service.py executed as script
    # do something

    # service_func()
    
    # sequential execution
    pgmTo2dPoints.main()
    sensorFusionToPoints.main()