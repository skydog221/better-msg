import Bbcode from './module/bbcode'
import Swal, { SweetAlertOptions } from 'sweetalert2'
import rawL10n from './l10n'
// @ts-ignore
import 'animate.css'
// @ts-ignore
import './index.css'

// ==================== 类型定义 ====================

interface BlockArgs {
  [key: string]: any
}

interface BaseModalArgs {
  title: string
  content: string
  anim: string
  color: string
}

interface ModalArgs extends BaseModalArgs {
  type: string
}

interface AutoCloseModalArgs extends ModalArgs {
  time: string | number
}

interface ToastArgs {
  type: string
  content: string
  time: number
  color: string
}

interface InputArgs extends BaseModalArgs {
  hang: string
}

interface RangeArgs extends BaseModalArgs {
  min: number
  max: number
  step: number
}

type InputType = SweetAlertOptions['input']

// ==================== 常量定义 ====================

const CONSTANTS = {
  URLS: {
    ICON: 'https://m.ccw.site/user_projects_assets/93083f163c567ae16fd884b06b8a39d1.png',
    PICTURE:
      'https://m.ccw.site/user_projects_assets/4ca6dd177cae82dd892f48903dc2c5c2.svg'
  },
  COLORS: {
    PRIMARY: '#d9963a',
    CONFIRM: '#3085d6',
    CANCEL: '#d33',
    DEFAULT: '#000000'
  },
  ANIMATION: {
    SHOW: 'animate__animated animate__fadeIn animate__faster',
    HIDE: 'animate__animated animate__fadeOut animate__faster'
  },
  DEFAULTS: {
    MAX_PARSEABLE: 100,
    AUTO_CLOSE_TIME: 3
  }
} as const

// ==================== 主扩展类 ====================

;(function (Scratch) {
  if (Scratch.extensions.unsandboxed === false) {
    throw new Error('Sandboxed mode is not supported')
  }

  class BetterMsg implements Scratch.Extension {
    private lastValue: string | undefined
    private runtime: VM.Runtime
    private maxParsedable: number
    private _formatMessage: any

    constructor(runtime: VM.Runtime) {
      this.runtime = runtime
      this.maxParsedable = CONSTANTS.DEFAULTS.MAX_PARSEABLE
      // @ts-ignore
      this._formatMessage = runtime.getFormatMessage(rawL10n)
    }

    // ==================== 辅助方法 ====================

    /**
     * 国际化翻译
     */
    private l10n(id: keyof (typeof rawL10n)['zh-cn']): string {
      return this._formatMessage({
        id,
        default: id,
        description: id
      })
    }

    /**
     * 包装 Markdown 标签
     */
    private wrapMarkdown(text: string): string {
      return `[md]${text}[/md]`
    }

    /**
     * 解析 BBCode
     */
    private parseBBCode(text: string): string {
      return new Bbcode.Parser().toHTML(text, this.runtime, this.maxParsedable)
    }

    /**
     * 获取动画配置
     */
    private getAnimationConfig(
      enabled: boolean
    ): Pick<SweetAlertOptions, 'showClass' | 'hideClass'> {
      if (!enabled) return {}

      return {
        showClass: { popup: CONSTANTS.ANIMATION.SHOW },
        hideClass: { popup: CONSTANTS.ANIMATION.HIDE }
      }
    }

    /**
     * 创建基础 Swal 配置
     */
    private createBaseSwalConfig(args: BaseModalArgs): SweetAlertOptions {
      const title = this.parseBBCode(this.wrapMarkdown(args.title))
      const html = this.parseBBCode(this.wrapMarkdown(args.content))
      const animConfig = this.getAnimationConfig(args.anim === 'true')

      return {
        title,
        html,
        color: args.color,
        ...animConfig
      }
    }

    /**
     * 创建模态框配置
     */
    private createModalConfig(args: ModalArgs): SweetAlertOptions {
      return {
        ...this.createBaseSwalConfig(args),
        icon: args.type as any
      }
    }

    /**
     * 创建通用输入框
     */
    private async createInputModal(
      args: BaseModalArgs,
      inputType: InputType,
      options?: {
        extraHtml?: string
        inputAttributes?: Record<string, string>
        icon?: string
        didOpen?: () => void
      }
    ): Promise<void> {
      const config = this.createBaseSwalConfig(args)

      const { value } = await Swal.fire({
        ...config,
        input: inputType as any,
        icon: options?.icon as any,
        html: options?.extraHtml
          ? config.html + options.extraHtml
          : config.html,
        inputAttributes: options?.inputAttributes,
        didOpen: options?.didOpen
      })

      this.lastValue = value
    }

    /**
     * 创建 Block 定义的辅助方法
     */
    private createBlockDefinition(
      opcode: string,
      textKey: string,
      args: Record<string, any>
    ): any {
      return {
        blockType: Scratch.BlockType.COMMAND,
        opcode,
        text: this.l10n(textKey as any),
        arguments: args
      }
    }

    /**
     * 创建标准参数定义
     */
    private createStandardArgs(
      includeType = false,
      includeTime = false,
      includeHang = false
    ): Record<string, any> {
      const args: Record<string, any> = {}

      if (includeType) {
        args.type = {
          type: Scratch.ArgumentType.STRING,
          menu: 'type'
        }
      }

      args.title = {
        type: Scratch.ArgumentType.STRING,
        defaultValue: this.l10n('BetterMsg.success')
      }

      args.content = {
        type: Scratch.ArgumentType.STRING,
        defaultValue: this.l10n('BetterMsg.success')
      }

      args.anim = {
        type: Scratch.ArgumentType.STRING,
        menu: 'anim'
      }

      if (includeHang) {
        args.hang = {
          type: Scratch.ArgumentType.STRING,
          menu: 'hang'
        }
      }

      args.color = {
        type: Scratch.ArgumentType.COLOR,
        defaultValue: CONSTANTS.COLORS.DEFAULT
      }

      if (includeTime) {
        args.time = {
          type: Scratch.ArgumentType.NUMBER,
          defaultValue: CONSTANTS.DEFAULTS.AUTO_CLOSE_TIME
        }
      }

      return args
    }

    // ==================== Scratch 扩展接口 ====================

    getInfo(): any {
      return {
        id: 'BetterMsg',
        name: this.l10n('BetterMsg.name'),
        color1: CONSTANTS.COLORS.PRIMARY,
        color2: CONSTANTS.COLORS.PRIMARY,
        blockIconURI: CONSTANTS.URLS.ICON,
        menuIconURI: CONSTANTS.URLS.ICON,
        blocks: [
          // 基础弹窗组
          {
            blockType: Scratch.BlockType.LABEL,
            text: this.l10n('BetterMsg.tip1')
          },
          {
            blockType: Scratch.BlockType.COMMAND,
            opcode: 'openModal',
            text: this.l10n('BetterMsg.openModal'),
            hideFromPalette: true,
            arguments: this.createStandardArgs(true, false, false)
          },
          this.createBlockDefinition(
            'openModalAutoClose',
            'BetterMsg.openModalAutoClose',
            this.createStandardArgs(true, true, false)
          ),
          {
            blockType: Scratch.BlockType.COMMAND,
            opcode: 'openModalRight',
            text: this.l10n('BetterMsg.openModalRight'),
            arguments: {
              type: {
                type: Scratch.ArgumentType.STRING,
                menu: 'type'
              },
              content: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: this.l10n('BetterMsg.success')
              },
              time: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: CONSTANTS.DEFAULTS.AUTO_CLOSE_TIME
              },
              color: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: CONSTANTS.COLORS.DEFAULT
              }
            }
          },

          // 交互弹窗组
          {
            blockType: Scratch.BlockType.LABEL,
            text: this.l10n('BetterMsg.tip3')
          },
          {
            blockType: Scratch.BlockType.COMMAND,
            opcode: 'okUI',
            text: this.l10n('BetterMsg.okUI'),
            arguments: {
              title: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '确定要继续吗？'
              },
              content: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '请慎重选择'
              },
              anim: {
                type: Scratch.ArgumentType.STRING,
                menu: 'anim'
              },
              color: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: CONSTANTS.COLORS.DEFAULT
              }
            }
          },
          this.createBlockDefinition('input', 'BetterMsg.input', {
            title: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '请输入用户名'
            },
            content: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '在这里输入你的用户名~'
            },
            anim: {
              type: Scratch.ArgumentType.STRING,
              menu: 'anim'
            },
            hang: {
              type: Scratch.ArgumentType.STRING,
              menu: 'hang'
            },
            color: {
              type: Scratch.ArgumentType.COLOR,
              defaultValue: CONSTANTS.COLORS.DEFAULT
            }
          }),
          this.createBlockDefinition('password', 'BetterMsg.pwd', {
            title: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '请输入密码'
            },
            content: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '在这里输入你的密码~'
            },
            anim: {
              type: Scratch.ArgumentType.STRING,
              menu: 'anim'
            },
            color: {
              type: Scratch.ArgumentType.COLOR,
              defaultValue: CONSTANTS.COLORS.DEFAULT
            }
          }),
          this.createBlockDefinition('email', 'BetterMsg.email', {
            title: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '请输入邮箱'
            },
            content: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '在这里输入你的邮箱~'
            },
            anim: {
              type: Scratch.ArgumentType.STRING,
              menu: 'anim'
            },
            color: {
              type: Scratch.ArgumentType.COLOR,
              defaultValue: CONSTANTS.COLORS.DEFAULT
            }
          }),
          this.createBlockDefinition('url', 'BetterMsg.url', {
            title: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '请输入链接'
            },
            content: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '在这里输入你个人主页的链接~'
            },
            anim: {
              type: Scratch.ArgumentType.STRING,
              menu: 'anim'
            },
            color: {
              type: Scratch.ArgumentType.COLOR,
              defaultValue: CONSTANTS.COLORS.DEFAULT
            }
          }),
          this.createBlockDefinition('date', 'BetterMsg.date', {
            title: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '请输入日期'
            },
            content: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '点击小日历即可选择日期嗷~'
            },
            anim: {
              type: Scratch.ArgumentType.STRING,
              menu: 'anim'
            },
            color: {
              type: Scratch.ArgumentType.COLOR,
              defaultValue: CONSTANTS.COLORS.DEFAULT
            }
          }),
          {
            blockType: Scratch.BlockType.COMMAND,
            opcode: 'range',
            text: this.l10n('BetterMsg.range'),
            arguments: {
              title: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '你几岁了？'
              },
              content: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '请选择你的年龄'
              },
              step: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              anim: {
                type: Scratch.ArgumentType.STRING,
                menu: 'anim'
              },
              color: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: CONSTANTS.COLORS.DEFAULT
              },
              min: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 25
              },
              max: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              }
            }
          },

          // 获取值
          {
            opcode: 'getValue',
            text: this.l10n('BetterMsg.getValue'),
            blockType: Scratch.BlockType.REPORTER
          },

          // 控制组
          {
            blockType: Scratch.BlockType.LABEL,
            text: this.l10n('BetterMsg.tip2')
          },
          {
            blockType: Scratch.BlockType.COMMAND,
            opcode: 'alerts',
            text: this.l10n('BetterMsg.alerts'),
            arguments: {
              open: {
                type: Scratch.ArgumentType.STRING,
                menu: 'open'
              }
            }
          },

          // 帮助信息
          {
            blockType: Scratch.BlockType.LABEL,
            text: ' '
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: this.l10n('BetterMsg.help1')
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: this.l10n('BetterMsg.help2')
          }
        ],
        menus: {
          type: [
            { text: this.l10n('BetterMsg.success'), value: 'success' },
            { text: this.l10n('BetterMsg.warning'), value: 'warning' },
            { text: this.l10n('BetterMsg.error'), value: 'error' },
            { text: this.l10n('BetterMsg.info'), value: 'info' },
            { text: this.l10n('BetterMsg.question'), value: 'question' }
          ],
          anim: [
            { text: this.l10n('BetterMsg.animOk'), value: 'true' },
            { text: this.l10n('BetterMsg.animNo'), value: 'false' }
          ],
          open: [
            { text: this.l10n('BetterMsg.oalert'), value: 'open' },
            { text: this.l10n('BetterMsg.calert'), value: 'close' }
          ],
          hang: [
            { text: this.l10n('BetterMsg.dh'), value: 'one' },
            { text: this.l10n('BetterMsg.mh'), value: 'many' }
          ]
        }
      }
    }

    // ==================== Block 实现方法 ====================

    /**
     * 获取最后一次输入的值
     */
    getValue(): string | undefined {
      return this.lastValue
    }

    /**
     * 打开基础模态框
     */
    openModal(args: BlockArgs): void {
      Swal.fire(this.createModalConfig(args as ModalArgs))
    }

    /**
     * 打开自动关闭的模态框
     */
    openModalAutoClose(args: BlockArgs): void {
      const modalArgs = args as AutoCloseModalArgs
      const config = this.createModalConfig(modalArgs)
      const timer =
        modalArgs.time === '0' ? undefined : Number(modalArgs.time) * 1000

      Swal.fire({
        ...config,
        timer
      })
    }

    /**
     * 打开右上角 Toast 通知
     */
    openModalRight(args: BlockArgs): void {
      const toastArgs = args as ToastArgs
      const content = this.wrapMarkdown(toastArgs.content)

      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: toastArgs.time * 1000,
        icon: toastArgs.type as any,
        title: this.parseBBCode(content),
        color: toastArgs.color
      })
    }

    /**
     * 打开确认对话框
     */
    async okUI(args: BlockArgs): Promise<void> {
      const baseArgs = args as BaseModalArgs
      const config = this.createBaseSwalConfig(baseArgs)

      const result = await Swal.fire({
        ...config,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: CONSTANTS.COLORS.CONFIRM,
        cancelButtonColor: CONSTANTS.COLORS.CANCEL,
        confirmButtonText: 'YES',
        cancelButtonText: 'NO'
      })

      this.lastValue = String(result.isConfirmed)
    }

    /**
     * 打开输入框
     */
    async input(args: BlockArgs): Promise<void> {
      const inputArgs = args as InputArgs
      const inputType = inputArgs.hang === 'one' ? 'text' : 'textarea'
      await this.createInputModal(inputArgs, inputType)
    }

    /**
     * 打开密码输入框
     */
    async password(args: BlockArgs): Promise<void> {
      const warningText =
        '<br><p style="color: red;">拓展提醒：请注意浏览器是否自动填入你的平台密码，谨防泄露隐私信息。</p>'
      await this.createInputModal(args as BaseModalArgs, 'password', {
        icon: 'warning',
        extraHtml: warningText
      })
    }

    /**
     * 打开邮箱输入框
     */
    async email(args: BlockArgs): Promise<void> {
      await this.createInputModal(args as BaseModalArgs, 'email')
    }

    /**
     * 打开 URL 输入框
     */
    async url(args: BlockArgs): Promise<void> {
      const hintText =
        '<br><p style="color:red;">注：需要协议前缀(https://)</p>'
      await this.createInputModal(args as BaseModalArgs, 'url', {
        extraHtml: hintText
      })
    }

    /**
     * 打开日期选择器
     */
    async date(args: BlockArgs): Promise<void> {
      await this.createInputModal(args as BaseModalArgs, 'date', {
        didOpen: () => {
          const today = new Date().toISOString()
          const input = Swal.getInput()
          if (input) {
            input.min = today.split('T')[0]
          }
        }
      })
    }

    /**
     * 打开范围选择器
     */
    async range(args: BlockArgs): Promise<void> {
      const rangeArgs = args as RangeArgs
      await this.createInputModal(rangeArgs, 'range', {
        inputAttributes: {
          min: String(rangeArgs.min),
          max: String(rangeArgs.max),
          step: String(rangeArgs.step)
        }
      })
    }

    /**
     * 控制原生 alert 的开关
     */
    alerts(args: BlockArgs): void {
      const { open } = args

      if (open === 'open') {
        window.alert = (message: string) => {
          Swal.fire({
            icon: 'info',
            titleText: message
          })
        }
      } else {
        // 恢复原生 alert
        const iframe = document.createElement('iframe')
        iframe.style.cssText = 'border:0;width:0;height:0;display:none'
        document.body.appendChild(iframe)

        const iframeDoc = iframe.contentWindow?.document
        if (iframeDoc) {
          iframeDoc.write(
            '<script type="text/javascript">window.parent.alert = alert;</script>'
          )
          iframeDoc.close()
        }
      }
    }
  }

  // ==================== Gandi 平台支持 ====================

  window.tempExt = {
    Extension: BetterMsg,
    info: {
      name: 'BetterMsg.name',
      description: 'BetterMsg.descp',
      extensionId: 'BetterMsg',
      iconURL: CONSTANTS.URLS.PICTURE,
      insetIconURL: CONSTANTS.URLS.ICON,
      featured: true,
      disabled: false,
      collaborator: '多bug的啸天犬 @ CCW'
    },
    l10n: {
      'zh-cn': {
        'BetterMsg.name': '更好的弹窗',
        'BetterMsg.descp': '更好的弹窗！美观 | 实用 | 丰富'
      },
      en: {
        'BetterMsg.name': "Skydog's Better Message",
        'BetterMsg.descp': 'Better pop-up windows! Beautiful | Practical | Rich'
      }
    }
  }
})(Scratch)
