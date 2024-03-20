import React, { useState } from 'react'
import {
  CustomInputField,
  DetailStack,
  TitleColumn,
} from './loginScreen.styles'
import { useMobileCheck } from '@/hooks/mobileCheck'
import { handler as RegisterHandler } from '../api/handlers/register.service'
import { AccountCircle, Visibility, VisibilityOff } from '@mui/icons-material'
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material'
import { DesktopPxToVw } from '@/utils/pxToVw'
import { useRouter } from 'next/router'

export default function SignUp({ setIsSignIn }: any) {
  const isMobile = useMobileCheck()
  const router = useRouter()
  const [loading, setLoading]: any = useState(false)
  const inputFields = [
    {
      name: 'firstName',
      placeholder: 'First Name',
      fullWidth: false,
    },
    {
      name: 'lastName',
      placeholder: 'Last Name',
      fullWidth: false,
    },
    {
      name: 'email',
      placeholder: 'Enter your email',
      fullWidth: true,
    },
    {
      name: 'password',
      placeholder: 'Password',
      fullWidth: true,
    },
  ]
  //**states */
  const [showPassword, setShowPassword]: any = useState<Boolean>(false)
  const [payload, setPayload]: any = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    registeredAt: 'DRIFT',
  })

  const handlePayload = (e: any) => {
    const { value, name } = e?.target
    setPayload({
      ...payload,
      [name]: value,
    })
  }
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }
  const handleRegister = async () => {
    setLoading(true)
    try {
      const { error, data } = await RegisterHandler.apiCall(payload)
      if (error === false) {
        global?.window?.localStorage?.setItem('accessToken', data?.token)
        router?.reload()
      }
    } catch (error) {
      console.log('error at SSO Login', error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <TitleColumn>
        <Typography fontWeight={600} variant='h6'>
          REGISTER WITH US
        </Typography>
        <Typography variant='body2'>Enter your details to register</Typography>
      </TitleColumn>
      <DetailStack>
        {inputFields?.map((field: any, index: number) => (
          <FormControl
            variant='outlined'
            fullWidth={field?.fullWidth}
            sx={{
              flexBasis: field?.fullWidth ? 'unset' : '50%',
              paddingRight: !isMobile && index === 0 ? DesktopPxToVw(20) : 0,
            }}
          >
            <CustomInputField
              id={field?.name}
              name={field?.name}
              onChange={handlePayload}
              type={
                field?.name !== 'password' || showPassword ? 'text' : 'password'
              }
              disabled={loading}
              endAdornment={
                field?.name === 'email' ? (
                  <InputAdornment position='end'>
                    <AccountCircle />
                  </InputAdornment>
                ) : field?.name === 'password' ? (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={handleClickShowPassword}
                      edge='end'
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ) : (
                  <></>
                )
              }
              placeholder={field?.placeholder}
            />
          </FormControl>
        ))}
        <Button
          disabled={loading}
          fullWidth
          variant='contained'
          onClick={handleRegister}
          sx={{ backgroundColor: '#000' }}
        >
          Register
        </Button>
      </DetailStack>
      <TitleColumn>
        <Stack flexDirection={'row'} columnGap={'6px'}>
          <Typography variant='body2'>Already have an account?</Typography>
          <Typography
            variant='body2'
            fontWeight={600}
            sx={{ textDecoration: 'underline', cursor: 'pointer' }}
            onClick={() => setIsSignIn(true)}
          >
            Sign In
          </Typography>
        </Stack>
        <Typography variant='caption'>
          If you are already an existing user of Drift Clothing, kindly use the
          same credentials to sign in.
        </Typography>
      </TitleColumn>
    </>
  )
}
