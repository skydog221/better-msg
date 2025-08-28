import Bbcode from './module/bbcode'
import Swal from 'sweetalert2'
import 'animate.css'

interface BlockArgs {
  [key: string]: any
}

interface Extension {
  getInfo(): {
    id: string
    name: string
    color1?: string
    color2?: string
    blockIconURI?: string
    menuIconURI?: string
    blocks: any[]
    menus?: any
  }
}

;(function (Scratch) {
  const BetterMsgIconUrl =
    'https://m.ccw.site/user_projects_assets/0d3ec414f0339216c61c75922f68757f.svg'
  const BetterMsgPictureUrl =
    'https://m.ccw.site/user_projects_assets/5db8a064cf118bb46563e02718f3d761.svg'
  if (Scratch.extensions.unsandboxed === false) {
    throw new Error('Sandboxed mode is not supported')
  }

  function i10n(id: string): string {
    return Scratch.translate({ id, default: id, description: id })
  }

  class BetterMsg implements Extension {
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
            text: i10n('BetterMsg.help1')
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: i10n('BetterMsg.help2')
          },
          {
            blockType: Scratch.BlockType.COMMAND,
            opcode: 'openModal',
            text: i10n('BetterMsg.openModal'),
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
                defaultValue: '#4CAF50'
              }
            }
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
                defaultValue: '#4CAF50'
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
                defaultValue: '#4CAF50'
              }
            }
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
          ]
        }
      }
    }
    // code here

    openModal(args: BlockArgs): string | void {
      const content = '[md]' + args.content + '[/md]'
      const title = '[md]' + args.title + '[/md]'
      const type = args.type
      const anim = args.anim
      const color = args.color
      if (anim === 'true') {
        console.log('with animation')
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
          showClass: {
            popup: `
              animate__animated
              animate__fadeInUp
              animate__faster
            `
          },
          hideClass: {
            popup: `
              animate__animated
              animate__fadeOutDown
              animate__faster
            `
          }
        })
      } else {
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
          icon: type
        })
      }
      return
    }
    openModalAutoClose(args: BlockArgs): string | void {
      const content = '[md]' + args.content + '[/md]'
      const title = '[md]' + args.title + '[/md]'
      const type = args.type
      const anim = args.anim
      const color = args.color
      const time = args.time
      if (anim === 'true') {
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
          timer: time * 1000,
          showClass: {
            popup: `
              animate__animated
              animate__fadeInUp
              animate__faster
            `
          },
          hideClass: {
            popup: `
              animate__animated
              animate__fadeOutDown
              animate__faster
            `
          }
        })
      } else {
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
          timer: time * 1000
        })
      }
      return
    }
    openModalRight(args: BlockArgs): string | void {
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
      // alert YUEN有做限制，我就不做了
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
        'BetterMsg.descp': '更好的弹窗！美观|实用|丰富'
      },
      en: {
        'BetterMsg.name': "Skydog's Better Message",
        'BetterMsg.descp': 'Better pop-up windows! Beautiful | Practical | Rich'
      }
    }
  }
})(Scratch)
