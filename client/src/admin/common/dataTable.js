import React, { Component } from 'react';
import { Table, Button } from 'antd';
import _ from 'lodash';
import { getRequest } from '../../util/requestUtil';
import moment from 'moment';

class DataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],  // Check here to configure the default column
            loading: false,
            adminData: []
        };
    }

    componentDidMount = () => {
        
        getRequest(this.props.apiName, {})
        .then(response => response.data)
        .then(data => {
            let myData = [];
            var i = 0;
            data.forEach(element => {
                element.key = i;
                i = i+1;
                if (element.createdAt){
                    element.createdAt = moment(element.createdAt).format('YYYY-MM-DD HH:mm');
                }
                
                if (element.updatedAt){
                    element.updatedAt = moment(element.updatedAt).format('YYYY-MM-DD HH:mm');
                }

                myData.push(element);
            });
            this.setState({ adminData: myData });
        });
    }

    start = () => {
        this.setState({ loading: true });
        // ajax request after empty completing
        setTimeout(() => {
          this.setState({
            selectedRowKeys: [],
            loading: false,
          });
        }, 1000);
      }

    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }

    render() {
        const { tableName, columnNames } = this.props;
        const { loading, selectedRowKeys, adminData } = this.state;

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
          };
        let keylessColumnNames = columnNames.slice(1);
        const columns = keylessColumnNames.map((colName) => {
            return { title: _.startCase(colName), dataIndex: colName };
        });

        //   var data = [];
        //   for (let i = 0; i < 5; i++) {
        //   data.push({
        //       key: i,
        //       id: i,
        //       username: 32,
        //       createdAt: `London, Park Lane no. ${i}`,
        //       updatedAt: `London, Park Lane no. ${i}`,
        //   });
        //   }


          const hasSelected = selectedRowKeys.length > 0;
          return (
            <div>
              <div style={{ marginBottom: 16 }}>
                <Button
                  type="primary"
                  onClick={this.start}
                  disabled={hasSelected}
                  loading={loading}
                >
                  New Admin (Not implemented yet)
                </Button>
                <span style={{ marginLeft: 8 }}>
                  {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                </span>
              </div>
              <Table rowSelection={rowSelection} columns={columns} dataSource={adminData} />
            </div>
          );
    }
}

export default DataTable;