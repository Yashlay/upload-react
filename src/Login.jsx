import React from "react";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "login": "",
            "password": "",
            showError: false
        };
    }

    login = () => {
        if (this.state.login === "admin@admin.com" && this.state.password === "admin") {
            this.setState({
                showError: false
            });
            localStorage.setItem("isLoggedIn", "true");
            window.location.replace('/upload');
        } else {
            localStorage.setItem("isLoggedIn", "false");
            this.setState({
                showError: true
            });
        }

    }

    render() {
        return (
            <div className="App">
                <div style={{'borderBottom': '1px solid grey', 'marginBottom': '10px'}}>
                    <img src='https://www.gerab.com/images/logo.png' width='75px' height='75px' className='App-logo'
                         alt="logo"/>
                </div>
                <div className="flex flex-col creds">
                    <div className="title">Digital Certificate - MDM</div>
                    <div className="subTitle">
                        <div>You are accessing Gerab SaaS platform and is for authorized use only for employees, its
                            customers and contractors.
                        </div>
                        <div> All access within this platform is closely audited. If you think you aren't authorized to
                            use,
                            please refrain from doing so.
                        </div>
                    </div>
                    <div className="signInBlock">
                        <div className="signInTitle">
                            Log In or
                            <span className="signInCreateAccount"> Create an Account</span>
                        </div>
                        <div className="email">
                            <label htmlFor="email" className="emailLabel">Email</label>
                            <input className="Input_root__eG6Wl" autoComplete="off"
                                   value={this.state.login}
                                   autoCorrect="off" autoCapitalize="off" spellCheck="false"
                                   onChange={(e) => {
                                       this.setState({
                                           login: e.target.value
                                       });
                                   }}
                                   type="email" id="email">
                            </input>
                        </div>
                        <div className="pwd">
                            <label htmlFor="pass" className="passwordLabel">Password</label>
                            <input className="Input_root__eG6Wl" autoComplete="off" autoCorrect="off"
                                   autoCapitalize="off"
                                   spellCheck="false"
                                   value={this.state.password}
                                   onChange={(e) => {
                                       this.setState({
                                           password: e.target.value
                                       });
                                   }}
                                   type="password">
                            </input>
                        </div>
                        <div className="rememberMe">
                            <input type="checkbox" value="lsRememberMe" id="rememberMe"/>
                            <label htmlFor="rememberMe">Remember me</label>
                        </div>
                        {this.state.showError ? <div className="rememberMe" style={{"color": "red"}}>
                            <label htmlFor="rememberMe">Email or password entered by you is incorrect!</label>
                        </div> : ""}
                        <div style={{"display": "inline-flex"}}>
                            <div className="terms"> By signing in, you are agreeing to WIAN <span
                                style={{"color": "#4375A3", "cursor": "pointer"}}> Terms of Use </span> and <span
                                style={{"color": "#4375A3", cursor: "pointer"}}>Privacy Policy</span></div>
                            <button data-variant="slim" className="Button_root__G_l9X Button_slim__WmpZF"
                                    onClick={this.login} type="submit">Log
                                In
                            </button>
                        </div>
                    </div>
                    <div className="forgotPassword">
                        Forgot Password?
                    </div>
                </div>
            </div>


        );
    }
}

export default Login;