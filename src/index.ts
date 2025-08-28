import Bbcode from './module/bbcode'
import Swal from 'sweetalert2'
import 'animate.css'
import './index.css'
interface BlockArgs {
  [key: string]: any
}

;(function (Scratch) {
  const BetterMsgIconUrl =
    'https://m.ccw.site/user_projects_assets/93083f163c567ae16fd884b06b8a39d1.png'
  const BetterMsgPictureUrl =
    'https://m.ccw.site/user_projects_assets/4ca6dd177cae82dd892f48903dc2c5c2.svg'
  if (Scratch.extensions.unsandboxed === false) {
    throw new Error('Sandboxed mode is not supported')
  }

  function i10n(id: string): string {
    return Scratch.translate({ id, default: id, description: id })
  }

  class BetterMsg implements Scratch.Extension {
    lastValue: string | undefined
    public runtime: VM.Runtime
    public maxParsedable: number

    constructor(runtime: VM.Runtime) {
      this.runtime = runtime
      this.maxParsedable = 100
    }

    getInfo(): any {
      return {
        id: 'BetterMsg',
        name: i10n('BetterMsg.name'),
        color1: '#d9963a',
        color2: '#d9963a',
        blockIconURI: BetterMsgIconUrl,
        menuIconURI: BetterMsgIconUrl,
        blocks: [
          {
            blockType: Scratch.BlockType.LABEL,
            text: i10n('BetterMsg.tip1')
          },
          {
            blockType: Scratch.BlockType.COMMAND,
            opcode: 'openModalAutoClose',
            text: i10n('BetterMsg.openModalAutoClose'),
            arguments: {
              type: {
                type: Scratch.ArgumentType.STRING,
                menu: 'type'
              },
              title: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: i10n('BetterMsg.success')
              },
              content: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: i10n('BetterMsg.success')
              },
              anim: {
                type: Scratch.ArgumentType.STRING,
                menu: 'anim'
              },
              color: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#000000'
              },
              time: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 3
              }
            }
          },
          {
            blockType: Scratch.BlockType.COMMAND,
            opcode: 'openModalRight',
            text: i10n('BetterMsg.openModalRight'),
            arguments: {
              type: {
                type: Scratch.ArgumentType.STRING,
                menu: 'type'
              },
              content: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: i10n('BetterMsg.success')
              },
              time: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 3
              },
              color: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#000000'
              }
            }
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: i10n('BetterMsg.tip3')
          },
          {
            blockType: Scratch.BlockType.COMMAND,
            opcode: 'input',
            text: i10n('BetterMsg.input'),
            arguments: {
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
                defaultValue: '#000000'
              }
            }
          },
          {
            blockType: Scratch.BlockType.COMMAND,
            opcode: 'password',
            text: i10n('BetterMsg.pwd'),
            arguments: {
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
                defaultValue: '#000000'
              }
            }
          },
          {
            blockType: Scratch.BlockType.COMMAND,
            opcode: 'email',
            text: i10n('BetterMsg.email'),
            arguments: {
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
                defaultValue: '#000000'
              }
            }
          },
          {
            blockType: Scratch.BlockType.COMMAND,
            opcode: 'url',
            text: i10n('BetterMsg.url'),
            arguments: {
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
                defaultValue: '#000000'
              }
            }
          },
          {
            blockType: Scratch.BlockType.COMMAND,
            opcode: 'date',
            text: i10n('BetterMsg.date'),
            arguments: {
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
                defaultValue: '#000000'
              }
            }
          },
          {
            blockType: Scratch.BlockType.COMMAND,
            opcode: 'range',
            text: i10n('BetterMsg.range'),
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
                defaultValue: '#000000'
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
          {
            opcode: 'getValue',
            text: i10n('BetterMsg.getValue'),
            blockType: Scratch.BlockType.REPORTER
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: i10n('BetterMsg.tip2')
          },
          {
            blockType: Scratch.BlockType.COMMAND,
            opcode: 'alerts',
            text: i10n('BetterMsg.alerts'),
            arguments: {
              open: {
                type: Scratch.ArgumentType.STRING,
                menu: 'open'
              }
            }
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: ' '
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: i10n('BetterMsg.help1')
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: i10n('BetterMsg.help2')
          }
        ],
        menus: {
          type: [
            {
              text: i10n('BetterMsg.success'),
              value: 'success'
            },
            {
              text: i10n('BetterMsg.warning'),
              value: 'warning'
            },
            {
              text: i10n('BetterMsg.error'),
              value: 'error'
            },
            {
              text: i10n('BetterMsg.info'),
              value: 'info'
            },
            {
              text: i10n('BetterMsg.question'),
              value: 'question'
            }
          ],
          anim: [
            {
              text: i10n('BetterMsg.animOk'),
              value: 'true'
            },
            {
              text: i10n('BetterMsg.animNo'),
              value: 'false'
            }
          ],
          open: [
            {
              text: i10n('BetterMsg.oalert'),
              value: 'open'
            },
            {
              text: i10n('BetterMsg.calert'),
              value: 'close'
            }
          ],
          hang: [
            {
              text: i10n('BetterMsg.dh'),
              value: 'one'
            },
            {
              text: i10n('BetterMsg.mh'),
              value: 'many'
            }
          ]
        }
      }
    }
    getValue() {
      return this.lastValue
    }
    async range(args: BlockArgs) {
      const content = '[md]' + args.content + '[/md]'
      const title = '[md]' + args.title + '[/md]'

      const anim = args.anim
      const color = args.color

      const { value: v } = await Swal.fire({
        title: new Bbcode.Parser().toHTML(
          title,
          this.runtime,
          this.maxParsedable
        ),
        color: color,
        html: new Bbcode.Parser().toHTML(
          content,
          this.runtime,
          this.maxParsedable
        ),
        input: 'range',
        inputAttributes: {
          min: args.min,
          max: args.max,
          step: args.step
        },
        showClass:
          anim === 'true'
            ? {
                popup: `
              animate__animated
              animate__fadeIn
              animate__faster
            `
              }
            : undefined,
        hideClass:
          anim === 'true'
            ? {
                popup: `
              animate__animated
              animate__fadeOut
              animate__faster
            `
              }
            : undefined
      })
      this.lastValue = v
    }
    async date(args: BlockArgs) {
      const content = '[md]' + args.content + '[/md]'
      const title = '[md]' + args.title + '[/md]'

      const anim = args.anim
      const color = args.color

      const { value: v } = await Swal.fire({
        title: new Bbcode.Parser().toHTML(
          title,
          this.runtime,
          this.maxParsedable
        ),
        color: color,
        html: new Bbcode.Parser().toHTML(
          content,
          this.runtime,
          this.maxParsedable
        ),
        input: 'date',
        didOpen: () => {
          const today = new Date().toISOString()
          const input = Swal.getInput()
          if (input) {
            input.min = today.split('T')[0]
          }
        },
        showClass:
          anim === 'true'
            ? {
                popup: `
              animate__animated
              animate__fadeIn
              animate__faster
            `
              }
            : undefined,
        hideClass:
          anim === 'true'
            ? {
                popup: `
              animate__animated
              animate__fadeOut
              animate__faster
            `
              }
            : undefined
      })
      this.lastValue = v
    }
    async input(args: BlockArgs) {
      const content = '[md]' + args.content + '[/md]'
      const title = '[md]' + args.title + '[/md]'

      const anim = args.anim
      const color = args.color
      const { value: v } = await Swal.fire({
        title: new Bbcode.Parser().toHTML(
          title,
          this.runtime,
          this.maxParsedable
        ),
        color: color,
        html: new Bbcode.Parser().toHTML(
          content,
          this.runtime,
          this.maxParsedable
        ),
        input: args.hang === 'one' ? 'text' : 'textarea',

        showClass:
          anim === 'true'
            ? {
                popup: `
              animate__animated
              animate__fadeIn
              animate__faster
            `
              }
            : undefined,
        hideClass:
          anim === 'true'
            ? {
                popup: `
              animate__animated
              animate__fadeOut
              animate__faster
            `
              }
            : undefined
      })
      this.lastValue = v
    }
    async password(args: BlockArgs) {
      const content = '[md]' + args.content + '[/md]'
      const title = '[md]' + args.title + '[/md]'

      const anim = args.anim
      const color = args.color

      const { value: v } = await Swal.fire({
        title: new Bbcode.Parser().toHTML(
          title,
          this.runtime,
          this.maxParsedable
        ),
        color: color,
        html:
          new Bbcode.Parser().toHTML(
            content,
            this.runtime,
            this.maxParsedable
          ) +
          '<br><p style="color: red;">拓展提醒：请注意浏览器是否自动填入你的平台密码，谨防泄露隐私信息。</p>',
        input: 'password',

        showClass:
          anim === 'true'
            ? {
                popup: `
              animate__animated
              animate__fadeIn
              animate__faster
            `
              }
            : undefined,
        hideClass:
          anim === 'true'
            ? {
                popup: `
              animate__animated
              animate__fadeOut
              animate__faster
            `
              }
            : undefined
      })
      this.lastValue = v
    }
    async email(args: BlockArgs) {
      const content = '[md]' + args.content + '[/md]'
      const title = '[md]' + args.title + '[/md]'

      const anim = args.anim
      const color = args.color

      const { value: v } = await Swal.fire({
        title: new Bbcode.Parser().toHTML(
          title,
          this.runtime,
          this.maxParsedable
        ),
        color: color,
        html: new Bbcode.Parser().toHTML(
          content,
          this.runtime,
          this.maxParsedable
        ),
        input: 'email',

        showClass:
          anim === 'true'
            ? {
                popup: `
              animate__animated
              animate__fadeIn
              animate__faster
            `
              }
            : undefined,
        hideClass:
          anim === 'true'
            ? {
                popup: `
              animate__animated
              animate__fadeOut
              animate__faster
            `
              }
            : undefined
      })
      this.lastValue = v
    }
    async url(args: BlockArgs) {
      const content = '[md]' + args.content + '[/md]'
      const title = '[md]' + args.title + '[/md]'

      const anim = args.anim
      const color = args.color

      const { value: v } = await Swal.fire({
        title: new Bbcode.Parser().toHTML(
          title,
          this.runtime,
          this.maxParsedable
        ),
        color: color,
        html:
          new Bbcode.Parser().toHTML(
            content,
            this.runtime,
            this.maxParsedable
          ) + '<br><p style="color:red;">注：需要协议前缀(https://)</p>',
        input: 'url',

        showClass:
          anim === 'true'
            ? {
                popup: `
              animate__animated
              animate__fadeIn
              animate__faster
            `
              }
            : undefined,
        hideClass:
          anim === 'true'
            ? {
                popup: `
              animate__animated
              animate__fadeOut
              animate__faster
            `
              }
            : undefined
      })
      this.lastValue = v
    }
    openModalAutoClose(args: BlockArgs): void {
      const content = '[md]' + args.content + '[/md]'
      const title = '[md]' + args.title + '[/md]'
      const type = args.type
      const anim = args.anim
      const color = args.color
      const time = args.time

      Swal.fire({
        title: new Bbcode.Parser().toHTML(
          title,
          this.runtime,
          this.maxParsedable
        ),
        color: color,
        html: new Bbcode.Parser().toHTML(
          content,
          this.runtime,
          this.maxParsedable
        ),
        icon: type,
        timer: time === '0' ? undefined : time * 1000,
        showClass:
          anim === 'true'
            ? {
                popup: `
              animate__animated
              animate__fadeIn
              animate__faster
            `
              }
            : undefined,
        hideClass:
          anim === 'true'
            ? {
                popup: `
              animate__animated
              animate__fadeOut
              animate__faster
            `
              }
            : undefined
      })
    }
    openModalRight(args: BlockArgs): void {
      const color = args.color
      const content = '[md]' + args.content + '[/md]'
      const type = args.type
      const time = args.time * 1000
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: time,
        icon: type,
        title: new Bbcode.Parser().toHTML(
          content,
          this.runtime,
          this.maxParsedable
        ),
        color: color
      })
      return
    }
    alerts(args: BlockArgs): void {
      const open = args.open
      if (open === 'open') {
        window.alert = (e: string) => {
          Swal.fire({
            icon: 'info',
            titleText: e
          })
        }
      } else {
        const f = document.createElement('iframe')
        f.style.cssText = 'border:0;width:0;height:0;display:none'
        document.body.appendChild(f)
        const d = f.contentWindow?.document
        if (d) {
          d.write(
            '<script type="text/javascript">window.parent.alert = alert;</script>'
          )
          d.close()
        }
      }
    }
  }
  // For Gandi
  window.tempExt = {
    Extension: BetterMsg,
    info: {
      name: 'BetterMsg.name',
      description: 'BetterMsg.descp',
      extensionId: 'BetterMsg',
      iconURL: BetterMsgPictureUrl,
      insetIconURL: BetterMsgIconUrl,
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
