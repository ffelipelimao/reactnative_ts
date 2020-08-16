import React, { useCallback, useRef } from 'react';
import { Image, KeyboardAvoidingView, Platform, View, ScrollView, TextInput, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native'
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { useAuth } from '../../hooks/Auth'
import getValidationErros from '../../utils/getValidationErros';
import Input from '../../components/Input'
import Button from '../../components/Button'
import logoImage from '../../assets/logo.png'
import { Container, Title, ForgotPassword, ForgotPasswordText, CreateAccountButtonText, CreateAccountButton } from './styles'

interface SignInFormData {
    email: string;
    password: string;
}


const SignIn: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const passwordInputRef = useRef<TextInput>(null)
    const navigation = useNavigation();

    const { signIn } = useAuth()

    const handleSignIn = useCallback(async (data: SignInFormData) => {
        try {
            formRef.current?.setErrors({});
            const schema = Yup.object().shape({
                email: Yup.string().required('Email obrigatorio').email('Digite um email valido'),
                password: Yup.string().required('Senha obrigaria'),
            })

            await schema.validate(data, {
                abortEarly: false,
            });

            await signIn({
                email: data.email,
                password: data.password,
            });


        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const errors = getValidationErros(err)
                formRef.current?.setErrors(errors);
                return;
            }

            Alert.alert('Erro na Autenticação', 'Ocorreu um erro ao fazer o login, cheque as credenciais')
        }

    }, [signIn]);

    return (
        <>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flex: 1 }}>
                    <Container>
                        <Image source={logoImage} />
                        <View>
                            <Title>Faça seu logon </Title>
                        </View>
                        <Form ref={formRef} onSubmit={handleSignIn}>
                            <Input
                                name="email"
                                icon="mail"
                                placeholder="Email"
                                autoCorrect={false}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    passwordInputRef.current?.focus()
                                }}
                            />
                            <Input
                                ref={passwordInputRef}
                                name="password"
                                icon="lock"
                                placeholder="Senha"
                                secureTextEntry
                                returnKeyType="send"
                                onSubmitEditing={() => formRef.current?.submitForm()}
                            />

                            <Button onPress={() => formRef.current?.submitForm()}>Entrar</Button>
                        </Form>

                        <ForgotPassword>
                            <ForgotPasswordText>Esqueci Minha Senha</ForgotPasswordText>
                        </ForgotPassword>

                    </Container>
                </ScrollView>
            </KeyboardAvoidingView>

            <CreateAccountButton onPress={() => navigation.navigate('SignUp')} >
                <Icon name="log-in" size={20} color="#ff9000" />
                <CreateAccountButtonText >Crie uma conta</CreateAccountButtonText>
            </CreateAccountButton>
        </>
    )
}

export default SignIn;