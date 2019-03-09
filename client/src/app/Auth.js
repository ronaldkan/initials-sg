import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { getRequest } from '../util/requestUtil';

export default function withAuth(ComponentToProtect) {

    return class extends Component {
        constructor() {
            super();
            this.state = {
                loading: true,
                redirect: false,
            };
        }

        componentDidMount() {
            getRequest('/api/checkToken', {})
                .then(res => {
                    if (res.status === 200) {
                        this.setState({ loading: false });
                    }
                })
                .catch(err => {
                    this.setState({ loading: false, redirect: true });
                });
        }

        render() {
            const { loading, redirect } = this.state;
            let view = "";
            if (!loading) {
                if (redirect) {
                    view = <Redirect to="/platform/login" />
                } else {
                    view = <ComponentToProtect {...this.props} />
                }
            }
            return (
                <React.Fragment>
                    {view}
                </React.Fragment>
            );
        }
    }
}