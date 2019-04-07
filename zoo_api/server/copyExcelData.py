import sys

f = open(sys.argv[2], 'a')
f.write(sys.argv[1])
f.close()

exit(0)