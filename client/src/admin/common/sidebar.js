import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getRequest } from '../../util/requestUtil'; 

class Sidebar extends Component {

    componentDidMount() {
        // var currentPath = window.location.pathname;
        // currentPath = currentPath.replace("/admin", "");
        // if (currentPath.startsWith("/job") === true) {
        //     document.getElementById("idJob").classList.add("is-active");
        // } else {
        //     document.getElementById("idTemplate").classList.add("is-active");
        // }
    }

    logout = (getToHome) => {
        getRequest('/api/adminLogout', {}).then(resp => {
            if (resp.status === 200) {
                // getToHome();  
                window.location.reload(); // force refresh temp fix icon resize
            }
        }).catch((e) => 
        {
          console.error(e);
        });
    }

    render() {

        const { getToHome } = this.props;
        return (
            <div>
                <div className="sidenav" style={{ minHeight: '60vh' }}>
                    <aside className="sgds-menu sidebar__inner">
                        <ul className="sgds-menu-list">
                            {/* <li>
                                <a href="/admin"
                                    className="is-uppercase has-text-weight-semibold is-active">
                                    General
                                </a>
                                <ul>
                                    <li>
                                        <Link id="idTemplate" to="/admin"
                                            className="padding--sm">
                                            <small>Template</small>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link id="idJob" to="/admin/job"
                                            className="padding--sm">
                                            <small>Job</small>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/admin"
                                            className="padding--sm">
                                            <small>Activity</small>
                                        </Link>
                                    </li>
                                </ul>
                            </li> */}
                            <li>
                                <a href="/admin"
                                    className="is-uppercase has-text-weight-semibold is-active">
                                    Administrator
                                </a>
                                <ul>
                                    <li>
                                        <Link to="/admin/account"
                                            className="padding--sm">
                                            <small>Admin Accounts</small>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/admin/org"
                                            className="padding--sm">
                                            <small>Organizations</small>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/admin/addressbookentry"
                                            className="padding--sm">
                                            <small>Address Book Entries</small>
                                        </Link>
                                    </li>
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
