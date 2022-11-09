import React from 'react';
import { Button, Input, Space, Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

const handleSearch = (selectedKeys, confirm, dataIndex, setSearchText, setSearchedColumn) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
};

const handleReset = (clearFilters, setSearchText) => {
    clearFilters();
    setSearchText('');
};

export const getColumnSearchProps = (dataIndex, title, searchInput, setSearchText, searchText, setSearchedColumn, searchedColumn) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
            <Input
                ref={searchInput}
                placeholder={`Search ${title}`}
                value={selectedKeys[0]}
                onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex, setSearchText, setSearchedColumn)}
                style={{
                    marginBottom: 8,
                    display: 'block',
                }}
            />
            <Space>
                <Button
                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex, setSearchText, setSearchedColumn)}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{
                        width: 90,
                    }}
                >
                    Search
                </Button>
                <Button
                    onClick={() => clearFilters && handleReset(clearFilters, setSearchText)}
                    size="small"
                    style={{
                        width: 90,
                    }}
                >
                    Reset
                </Button>
                <Button
                    type="link"
                    size="small"
                    onClick={() => {
                        confirm({
                            closeDropdown: false,
                        });
                        setSearchText(selectedKeys[0]);
                        setSearchedColumn(dataIndex);
                    }}
                >
                    Filter
                </Button>
            </Space>
        </div>
    ),
    filterIcon: (filtered) => (
        <SearchOutlined
            style={{
                color: filtered ? '#1890ff' : undefined,
            }}
        />
    ),
    onFilter: (value, record) => {
        if (record[dataIndex]) {
            return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        } else {
            return false
        }
    },
    onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
            setTimeout(() => searchInput.current?.select(), 100);
        }
    },
    render: (text) => (
        <Tooltip placement="topLeft" title={text}>
            {searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            )}
        </Tooltip>
    ),
});
