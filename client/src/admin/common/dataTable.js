import React, { Component } from 'react';
import { Table, Button } from 'antd';
import { postRequest } from '../../util/requestUtil';

class DataTable extends Component {
    constructor() {
        super();
        this.state = {
            selectedRowKeys: [],  // Check here to configure the default column
            loading: false
        };
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
        // const {  } = this.props.form;
        const { loading, selectedRowKeys } = this.state;

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
          };

        const columns = [{
            title: 'ID',
            dataIndex: 'id',
          }, {
            title: 'Username',
            dataIndex: 'username',
          }, {
            title: 'Created At',
            dataIndex: 'createdAt',
          }, {
            title: 'Updated At',
            dataIndex: 'updatedAt',
          }];

          var data = [];
          for (let i = 0; i < 5; i++) {
          data.push({
              key: i,
              id: i,
              username: 32,
              createdAt: `London, Park Lane no. ${i}`,
              updatedAt: `London, Park Lane no. ${i}`,
          });
          }


          const hasSelected = selectedRowKeys.length > 0;
          return (
            <div>
              <div style={{ marginBottom: 16 }}>
                <Button
                  type="primary"
                  onClick={this.start}
                  disabled={!hasSelected}
                  loading={loading}
                >
                  Reload
                </Button>
                <span style={{ marginLeft: 8 }}>
                  {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                </span>
              </div>
              <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
            </div>
          );
    }
}

export default DataTable;