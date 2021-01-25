import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Redirect } from "react-router-dom";
import './Join.css';
import usersStore from '../../store/store'

export default observer(
  function SignIn() {
    const [name, setName] = useState('');

    function isUserExistsInLocalStorage(name, localStorageUsers) {
      usersStore.isLogInPast = localStorageUsers.includes(name)
      return usersStore.isLogInPast
    }

    function sighIn() {
      usersStore.isUserExistNow = ""
      usersStore.isLoogingIn = true
      usersStore.usersName = name

      let localStorageUsers = localStorage.getItem('user')

      //If there isnt any users in local storage
      if (localStorageUsers === null) {
        localStorage.setItem('user', JSON.stringify([name]))
      }

      //If there is any users in local storage
      else if (localStorageUsers !== null) {
        localStorageUsers = JSON.parse(localStorageUsers)
        let isUserExist = isUserExistsInLocalStorage(name, localStorageUsers)
        if (isUserExist) {
          return usersStore.isLoogingIn = true
        }
        else {
          let temp = []
          temp = [name].concat(localStorageUsers)
          localStorage.setItem('user', JSON.stringify(temp))
          return usersStore.isLoogingIn = true
        }
      }
    }

    if (usersStore.isLoogingIn) {
      return <Redirect to="/room"></Redirect>
    }
    else
      return (
        <div className="joinOuterContainer">
          <div className="joinInnerContainer">
            <h1 className="heading">Join</h1>
            <input placeholder="Name" className="joinInput" type="text" onChange={(event) => setName(event.target.value)} />
            <button onClick={sighIn} className={'button mt-20'} type="submit">Sign In</button>
            <h5 className="footer">{usersStore.isUserExistNow}</h5>
          </div>
        </div>
      );
  }
)