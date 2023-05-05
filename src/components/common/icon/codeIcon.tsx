
import { Icon, IconProps } from '@hope-ui/solid';
import { Component } from 'solid-js';

export const CodeIcon: Component<IconProps> = (props: IconProps) => {

    return (
        <Icon viewBox="0 0 57 57" {...props}>
            <path stroke="currentColor" stroke-width="3px" d="M20,44c-0.256,0-0.512-0.098-0.707-0.293L4.586,29l14.707-14.707c0.391-0.391,1.023-0.391,1.414,0  s0.391,1.023,0,1.414L7.414,29l13.293,13.293c0.391,0.391,0.391,1.023,0,1.414C20.512,43.902,20.256,44,20,44z" />
            <path stroke="currentColor" stroke-width="3px" d="M37,44c-0.256,0-0.512-0.098-0.707-0.293c-0.391-0.391-0.391-1.023,0-1.414L49.586,29L36.293,15.707  c-0.391-0.391-0.391-1.023,0-1.414s1.023-0.391,1.414,0L52.414,29L37.707,43.707C37.512,43.902,37.256,44,37,44z" />
        </Icon>
    )
};

