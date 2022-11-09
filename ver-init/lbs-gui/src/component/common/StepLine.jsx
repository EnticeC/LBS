import React from 'react';
import HorizontalLine from './HorizontalLine';
import TextNode from './TextNode';

export default ({ steps, currentStep }) => {
    return (
        <div
            style={{
                position: 'relative',
                width: '80%',
                margin: '5px auto',
                transform: 'translateX(-15px)',
            }}
        >
            {steps.map((step, index) => {
                if (index === 0)
                    return (
                        <TextNode
                            left={0}
                            text={index + 1 + ''}
                            note={step}
                            status={index < currentStep ? 'finished' : index === currentStep ? 'current' : ''}
                            key={index}
                        />
                    );
                else
                    return [
                        <HorizontalLine
                            left={((index - 1) / (steps.length - 1)) * 100 + '%'}
                            length={100 / (steps.length - 1) + '%'}
                            dashed={index > currentStep ? true : false}
                            key={2 * index - 1}
                        />,
                        <TextNode
                            left={(index / (steps.length - 1)) * 100 + '%'}
                            text={index + 1 + ''}
                            note={step}
                            status={index < currentStep ? 'finished' : index === currentStep ? 'current' : ''}
                            key={2 * index}
                        />,
                    ];
            })}
        </div>
    );
};
