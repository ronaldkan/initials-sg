import React, { Component } from 'react';

class Sidebar extends Component {

    componentDidMount() {
        var currentPath = window.location.pathname;
        currentPath = currentPath.replace("/demo", "");
        console.log(currentPath);
        if (currentPath.startsWith("/job") === true) {
            document.getElementById("idJob").classList.add("is-active");
        } else {
            document.getElementById("idTemplate").classList.add("is-active");
        }
    }

    render() {
        return (
            <div>
                <div className="sidenav" style={{ minHeight: '60vh' }}>
                    <aside className="sgds-menu sidebar__inner">
                        <ul className="sgds-menu-list">
                            <li>
                                <a href="/docs/"
                                    className="is-uppercase has-text-weight-semibold is-active">
                                    General
                                </a>
                                <ul>
                                    <li>
                                        <a id="idTemplate" href="/demo"
                                            className="padding--sm">
                                            <small>Template</small>
                                        </a>
                                    </li>
                                    <li>
                                        <a id="idJob" href="/demo/job"
                                            className="padding--sm">
                                            <small>Job</small>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/docs/main-nav/"
                                            className="padding--sm">
                                            <small>Activity</small>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a href="/docs/"
                                    className="is-uppercase has-text-weight-semibold is-active">
                                    Account Setting
                                </a>
                                <ul>
                                    <li>
                                        <a href="/docs/container/"
                                            className="padding--sm">
                                            <small>Organization</small>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/docs/grid/"
                                            className="padding--sm">
                                            <small>Account</small>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/docs/grid/"
                                            className="padding--sm">
                                            <small>Usage</small>
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
