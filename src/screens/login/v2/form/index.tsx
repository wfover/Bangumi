/*
 * @Author: czy0729
 * @Date: 2019-07-17 09:28:58
 * @Last Modified by: czy0729
 * @Last Modified time: 2025-02-28 17:21:47
 */
import React from 'react'
import { Image as RNImage, View } from 'react-native'
import ActivityIndicator from '@ant-design/react-native/lib/activity-indicator'
import { Button, Flex, Heatmap, Iconfont, Input, Mesume, Text, Touchable } from '@components'
import { Popover } from '@_'
import { _ } from '@stores'
import { alert } from '@utils'
import { ob } from '@utils/decorators'
import { t } from '@utils/fetch'
import { FROZEN_FN, HOST, HOST_2, HOST_3, WEB } from '@constants'
import i18n from '@constants/i18n'
import { memoStyles } from './styles'
import { Props } from './types'

const DATA = [HOST, HOST_2, HOST_3] as const

class Form extends React.Component<Props> {
  static defaultProps = {
    host: '',
    forwardRef: FROZEN_FN,
    onGetCaptcha: FROZEN_FN,
    onFocus: FROZEN_FN,
    onBlur: FROZEN_FN,
    onChange: FROZEN_FN,
    onSelect: FROZEN_FN,
    onUAChange: FROZEN_FN,
    onLogin: FROZEN_FN
  }

  state = {
    config: false
  }

  componentDidMount() {
    const { email, password, captcha } = this.props
    if (email && password && !captcha) {
      try {
        if (typeof this?.codeRef?.inputRef?.focus === 'function') {
          this.codeRef.inputRef.focus()
        }
      } catch (error) {}
    }
  }

  passwordRef

  codeRef

  showConfig = () => {
    return this.setState({
      config: true
    })
  }

  onNoticeHost = () => {
    t('登陆.配置提示', {
      name: 'host'
    })

    alert(
      `三个选项都是同一个站点的不同域名，只是具体服务器位置不同。 \n\n${i18n.login()}建议优先使用 bgm.tv，出现问题再尝试 bangumi.tv，最后尝试 chii.in。`
    )
  }

  onNoticeUA = () => {
    t('登陆.配置提示', {
      name: 'ua'
    })

    alert(
      `假如您频繁掉授权状态，不妨试试把这个选项勾上，通常${i18n.login()}状态生存时间为7天。 \n\n这是个不稳定的选项，若${i18n.login()}正常不建议勾上，可能会遇到预测不能的状况。`
    )
  }

  onSubmitEditingEmail = () => {
    try {
      if (typeof this?.passwordRef?.inputRef?.focus === 'function') {
        this.passwordRef.inputRef.focus()
      }
    } catch (error) {}
  }

  onSubmitEditingPassword = () => {
    try {
      if (typeof this?.codeRef?.inputRef?.focus === 'function') {
        this.codeRef.inputRef.focus()
      }
    } catch (error) {}
  }

  renderForm() {
    const {
      email,
      password,
      captcha,
      base64,
      forwardRef,
      onGetCaptcha,
      onFocus,
      onBlur,
      onChange,
      onLogin
    } = this.props
    return (
      <>
        <Flex style={_.mt.lg}>
          <Flex.Item>
            <Input
              style={this.styles.input}
              value={email}
              placeholder='Email'
              autoComplete='username'
              textContentType='username'
              returnKeyType='next'
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={evt => onChange(evt, 'email')}
              onSubmitEditing={this.onSubmitEditingEmail}
            />
          </Flex.Item>
        </Flex>
        <Flex style={_.mt.md}>
          <Flex.Item>
            <Input
              ref={ref => (this.passwordRef = ref)}
              style={this.styles.input}
              value={password}
              placeholder='密码'
              autoComplete='password'
              textContentType='password'
              secureTextEntry
              returnKeyType='next'
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={evt => onChange(evt, 'password')}
              onSubmitEditing={this.onSubmitEditingPassword}
            />
          </Flex.Item>
        </Flex>
        <Flex style={_.mt.md}>
          <Flex.Item>
            <Input
              ref={ref => {
                forwardRef(ref)
                this.codeRef = ref
              }}
              style={this.styles.input}
              value={captcha}
              placeholder='验证码'
              returnKeyType='done'
              returnKeyLabel={i18n.login()}
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={evt => onChange(evt, 'captcha')}
              onSubmitEditing={onLogin}
            />
          </Flex.Item>
          <Touchable style={this.styles.touchCaptcha} onPress={onGetCaptcha}>
            <Flex style={this.styles.captchaContainer} justify='center'>
              {base64 ? (
                <RNImage
                  style={this.styles.captcha}
                  source={{
                    uri: base64
                  }}
                />
              ) : (
                <ActivityIndicator size='small' />
              )}
            </Flex>
          </Touchable>
        </Flex>
      </>
    )
  }

  renderConfig() {
    const { failed, isCommonUA, host, onSelect, onUAChange } = this.props
    if (!failed) return null

    const { config } = this.state
    if (!config) {
      return (
        <Touchable style={[this.styles.touch, _.mt.sm]} onPress={this.showConfig}>
          <Flex style={this.styles.content}>
            <Text type='sub' size={12}>
              {i18n.login()}配置
            </Text>
            <Iconfont name='md-navigate-next' />
          </Flex>
          <Heatmap id='登陆.切换域名' />
          <Heatmap bottom={-32} id='登陆.配置提示' transparent />
        </Touchable>
      )
    }

    return (
      <>
        <Flex style={[this.styles.touch, _.mt.sm]}>
          <Flex.Item>
            <Popover style={this.styles.touch} data={DATA} onSelect={onSelect}>
              <Flex style={this.styles.content}>
                <Text type='sub' size={12}>
                  使用 {host} 进行{i18n.login()}
                </Text>
                <Iconfont name='md-keyboard-arrow-down' />
              </Flex>
            </Popover>
          </Flex.Item>
          <Touchable style={this.styles.touchIcon} onPress={this.onNoticeHost}>
            <Flex style={this.styles.icon} justify='center'>
              <Iconfont name='md-info-outline' size={18} />
            </Flex>
          </Touchable>
        </Flex>
        <Flex style={this.styles.touch}>
          <Flex.Item>
            <Touchable style={this.styles.touch} onPress={onUAChange}>
              <Flex style={this.styles.content}>
                <Iconfont
                  name={isCommonUA ? 'md-radio-button-on' : 'md-radio-button-off'}
                  color={isCommonUA ? _.colorMain : _.colorSub}
                  size={18}
                />
                <Text style={_.ml.xs} type='sub' size={12}>
                  使用固定UA{i18n.login()} (频繁掉线请勾选)
                </Text>
              </Flex>
            </Touchable>
          </Flex.Item>
          <Touchable style={this.styles.touchIcon} onPress={this.onNoticeUA}>
            <Flex style={this.styles.icon} justify='center'>
              <Iconfont name='md-info-outline' size={18} />
            </Flex>
          </Touchable>
        </Flex>
      </>
    )
  }

  renderError() {
    const { navigation, info } = this.props
    const isError = info.includes('错误')
    return (
      <>
        <Text
          style={_.mt.md}
          size={12}
          lineHeight={16}
          type='sub'
          onPress={() => {
            if (isError) {
              navigation.push('Login')
            }
          }}
        >
          {info}
        </Text>
        {isError && (
          <Text
            style={_.mt.md}
            size={12}
            lineHeight={16}
            type='sub'
            onPress={() => navigation.push('LoginAssist')}
          >
            请尝试切换另一域名进行重试，或尝试切换wifi或4g网络，实在没法{i18n.login()}
            ，可点击这里前往辅助{i18n.login()}→
          </Text>
        )}
      </>
    )
  }

  render() {
    const { loading, onLogin } = this.props
    return (
      <View style={_.container.column}>
        <View style={this.styles.form}>
          <Flex justify='center'>
            <Mesume />
          </Flex>
          {this.renderForm()}
          {!WEB && this.renderConfig()}
          <Button style={_.mt.lg} type='main' shadow loading={loading} onPress={onLogin}>
            {i18n.login()}
          </Button>
          {this.renderError()}
        </View>
      </View>
    )
  }

  get styles() {
    return memoStyles()
  }
}

export default ob(Form)
