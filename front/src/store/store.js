import { extendObservable } from 'mobx';

class UsersStore {
    constructor() {
        extendObservable(this, {
            isLoogingIn: false,
            usersName: "",
            isLogInPast: false,
            isUserExistNow:""
        })
    }
}

export default new UsersStore()