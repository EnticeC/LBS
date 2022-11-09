import React, { useCallback, useEffect, useState } from 'react';
import '../../css/section.css';

const Section = React.forwardRef((props, ref) => {
    const { title, initiallyOpen, children } = props;
    // })
    // const Section = ({ title, initiallyOpen, children }: Props) => {
    const [isOpen, setIsOpen] = useState(initiallyOpen);

    useEffect(() => {
        setIsOpen(initiallyOpen);
    }, [initiallyOpen]);

    const titleClickHandler = useCallback(() => {
        setIsOpen(!isOpen);
    }, [isOpen, setIsOpen]);

    return (
        <section className="section" ref={ref}>
            <button className={'section-title ' + (isOpen ? ' is-open' : '')} onClick={titleClickHandler}>
                {title}
            </button>
            {isOpen && children}
        </section>
    );
});

Section.defaultProps = {
    initiallyOpen: true,
};

export default Section;
