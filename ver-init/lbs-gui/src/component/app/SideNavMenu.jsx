import React, { Component } from 'react';
import { FaChevronRight } from 'react-icons/fa';

export default class SideNavMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: props.isOpen,
        };
    }

    static defaultProps = {
        isOpen: false,
    };

    static menuToggleIcon = (<FaChevronRight />);

    toggleMenu = (e) => {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    };

    render() {
        const { icon, title, children } = this.props;
        return (
            <div className={'nav-menu' + (this.state.isOpen ? ' is-open' : '')}>
                <div className="nav-menu-title">
                    {icon}&nbsp;&nbsp;{title}
                    <button className="nav-menu-toggle" onClick={this.toggleMenu}>
                        {SideNavMenu.menuToggleIcon}
                    </button>
                </div>
                {this.state.isOpen && children}
            </div>
        );
    }
}
