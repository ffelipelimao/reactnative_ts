import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState, useCallback } from 'react';
import { TextInputProps } from 'react-native';
import { useField } from '@unform/core'


import { Container, TextInput, Icon } from './styles';

interface InputProps extends TextInputProps {
    name: string;
    icon: string;
}

interface InputValueRefere {
    value: string;
}

interface InputRef {
    focus(): void
}

const Input: React.RefForwardingComponent<InputRef, InputProps> = ({ name, icon, ...rest }, ref) => {

    const InputElementRef = useRef<any>(null);

    const { fieldName, clearError, registerField, error, defaultValue = '' } = useField(name)

    const inputValueRef = useRef<InputValueRefere>({ value: defaultValue });

    const [isFocus, setIsFocus] = useState(false);

    const [isFilled, setisFilled] = useState(false);

    const handleInputFocus = useCallback(() => {
        setIsFocus(true)
    }, [])

    const handleInputBlur = useCallback(() => {
        setIsFocus(false)

        setisFilled(!!inputValueRef.current.value)

    }, [])

    useImperativeHandle(ref, () => ({
        focus() {
            InputElementRef.current.focus();
        }
    }))

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputValueRef.current,
            path: 'value',
            setValue(ref: any, value: string) {
                inputValueRef.current.value = value;
                InputElementRef.current.setNativeProps({ text: value })

            },
            clearValue() {
                inputValueRef.current.value = '';
                InputElementRef.current.clear();
            }
        })
    }, [fieldName, registerField])

    return (<Container isFocus={isFocus} isErrored={!!error}>
        <Icon name={icon} size={20} color={isFocus || isFilled ? '#ff9000' : '#666360'} />
        <TextInput
            ref={InputElementRef}
            keyboardAppearance="dark"
            placeholderTextColor="#666360"
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            defaultValue={defaultValue}
            onChangeText={value => inputValueRef.current.value = value}
            {...rest}
        />
    </Container>
    )
}

export default forwardRef(Input);