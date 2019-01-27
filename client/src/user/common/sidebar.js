import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as Cookies from 'js-cookie';

class Sidebar extends Component {

    componentDidMount() {
        var currentPath = window.location.pathname;
        currentPath = currentPath.replace("/platform", "");
        if (currentPath.startsWith("/job") === true) {
            document.getElementById("idJob").classList.add("is-active");
        } else {
            document.getElementById("idTemplate").classList.add("is-active");
        }
    }

    logout = (getToHome) => {
        Cookies.remove("token");
        getToHome();
    }

    render() {

        const { getToHome } = this.props;
        return (
            <div>
                <div className="sidenav" style={{ minHeight: '60vh' }}>
                    <aside className="sgds-menu sidebar__inner">
                        <ul className="sgds-menu-list">
                            <li>
                                <a href="/platform"
                                    className="is-uppercase has-text-weight-semibold is-active">
                                    General
                                </a>
                                <ul>
                                    <li>
                                        <Link id="idTemplate" to="/platform"
                                            className="padding--sm">
                                            <small>Template</small>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link id="idJob" to="/platform/job"
                                            className="padding--sm">
                                            <small>Job</small>
                                        </Link>
                                    </li>
                                    {/* <li>
                                        <Link to="/platform"
                                            className="padding--sm">
                                            <small>Activity</small>
                                        </Link>
                                    </li> */}
                                </ul>
                            </li>
                            <li>
                                <a href="/platform"
                                    className="is-uppercase has-text-weight-semibold is-active">
                                    Account Setting
                                </a>
                                <ul>
                                    {/* <li>
                                        <Link to="/platform"
                                            className="padding--sm">
                                            <small>Organization</small>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/platform/account"
                                            className="padding--sm">
                                            <small>Account</small>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/platform"
                                            className="padding--sm">
                                            <small>Usage</small>
                                        </Link>
                                    </li> */}
                                    <li>
                                        <a onClick={() => this.logout(getToHome)}
                                            className="padding--sm">
                                            <small>Log out</small>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </aside>
                </div>
            </div>

        );
    }
}

export default Sidebar;
