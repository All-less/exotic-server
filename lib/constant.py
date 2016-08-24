DELIMITER = '\n'
bDELIMITER = b'\n'

TYPE_ACTION = 0
TYPE_STATUS = 1
TYPE_OPERATION = 2
TYPE_INFO = 3

TYPES = {
    TYPE_STATUS: 'status',
    TYPE_ACTION: 'action',
    TYPE_OPERATION: 'operation',
    TYPE_INFO: 'info'
}

CODE_ERROR = -1
CODE_ACQUIRE = 1
CODE_RELEASE = 2
CODE_USER_CHANGE = 3
CODE_BROADCAST = 4
CODE_AUTH = 5

CODES = {
    'error': CODE_ERROR,
    'acquire': CODE_ACQUIRE,
    'release': CODE_RELEASE,
    'user_changed': CODE_USER_CHANGE,
    'broadcast': CODE_BROADCAST,
    'authorize': CODE_AUTH
}
