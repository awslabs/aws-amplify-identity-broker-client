import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import authClient from '../Auth';

class NavBar extends React.Component<any> {
    constructor(props: any) {
        super(props);
    }

    logout = () => {
        authClient.logout();
        this.props.history.replace('/');
    };

    render() {
        return (
            < nav className="navbar navbar-dark bg-primary fixed-top" >
                <Link className="navbar-brand" to="/">
                    Sample PKCE Client
      </Link>
                {
                    !authClient.isLoggedIn() &&
                    < button className="btn btn-dark" onClick={authClient.login}>Log In</button>
                }
                {
                    authClient.isLoggedIn() &&
                    < div >
                        <label className="mr-2 text-white">Your are logged in as: {authClient.getUserInfo().email}</label>
                        <button className="btn btn-dark" onClick={() => { this.logout() }}>Log Out</button>
                    </div >
                }
            </nav >
        );
    }
}

export default withRouter(NavBar);