// 'enumify' has to be lowercase
const Enumify = require('enumify');

class UserType extends Enumify.Enum { 
    isTutor () {
        switch(this){
            case UserType.Tutor:
                return true;
            default:
                return false;
        }
    }

    isStudent () {
        switch(this){
            case UserType.Student:
                return true;
            default:
                return false;
        }
    }

    isAdmin () {
        switch(this){
            case UserType.Admin:
                return true;
            default:
                return false;
        }
    }

}
UserType.initEnum(['Admin', 'Student', 'Tutor']);

module.exports = UserType;