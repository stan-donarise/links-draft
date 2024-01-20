namespace $.$$ {

	export type $ss_blocks_block_focus_states = 'focused' | 'setting' | 'blurred'
	export type $ss_blocks_block_id = any

	export function $ss_blocks_block_anchor_el() {
		const sel = document.getSelection()
		const anchor_el = sel?.anchorNode as HTMLElement
		let el = anchor_el
		if( !anchor_el?.dataset?.type ) {
			el = sel?.anchorNode?.parentElement as HTMLElement
		}
		return el
	}
	function focus_el(): HTMLElement {
		const sel = document.getSelection()
		const focus_node = sel?.focusNode as HTMLElement
		let el = focus_node
		if( !focus_node?.dataset?.type ) {
			el = sel?.focusNode?.parentElement as HTMLElement
		}
		return el
	}
	export function $ss_blocks_block_trim( str: string ){
		return str?.at(-1) == '\n' ? str.slice(0, -1) : str
	}


	export class $ss_blocks_block extends $.$ss_blocks_block {
		@ $mol_mem
		br() {
			return document.createElement('br')
		}
		@ $mol_mem
		zero() {
			return document.createTextNode("\u200B")
		}

			
		@ $mol_mem
		sub( ) {
			const val = this.default_value()
			if( val && val != '\n' ) {
				return [ val ]
			}
			return [ this.zero() ] as readonly any[]
			// return [ this.br() ] as readonly any[]
		}

		@ $mol_mem
		update_value( data_value: string ) {
			console.log('data_value', data_value)
			const val = data_value || '\u200B'
			this.default_value = ()=> val
			const innerText = this.dom_node()?.parentElement?.innerText
			if ( val != innerText ) {
				const node = this.dom_node_actual()
				const sub = val == '\n' ? [ this.zero() ] : [ val  ]
				const nodes = sub.map( (child: any) => {
					if( child == null ) return null
					return ( child instanceof $mol_view )
						? child.dom_node()
						: child instanceof $mol_dom_context.Node
						? child
						: String( child )
				})
				$mol_dom_render_children( node , nodes )
				const sel = window.getSelection()!
				if ( val == '\u200B' ) {
					if ( sel.focusOffset == 1 ) {
						console.log('mod')
						sel.modify('extend', 'backward', 'character')
					} else {
						console.log('mod')
						sel.modify('extend', 'forward', 'character')
					}
				}
			}
		}

		input( e?: any ) {
			const innerText = this.dom_node()?.parentElement?.innerText
			// this.value_changed( innerText?.replace('\u200B', '') )
			this.value_changed( innerText )
		}

		// @ $mol_mem
		// before_content() {
		// 	return `"${ this.visible_placeholder() }"`
		// }

		@ $mol_mem
		after_content() {
			return `"${ this.visible_placeholder() }"`
		}

		@ $mol_mem
		empty() {
			return ['','\n','\u200B'].includes( this.value_changed() )
		}
		@ $mol_mem
		visible_placeholder() {
			const placeholder = this.placeholder()
			return this.empty() ? placeholder : ''
		}

		auto() {
			this.focused_or_hovered()
		}

		@ $mol_mem
		set_focused_or_hovered( args: { focused?: boolean, hovered?: boolean } ) {
			const { focused, hovered } = args
			if ( focused === undefined ) {
				this.on_focused_or_hovered( this.focused() || hovered )
			} else {
				this.on_focused_or_hovered( this.hovered() || focused )
			}
		}
		
		@ $mol_mem
		focus_state( next?: $ss_blocks_block_focus_states ) {
			if ( next == 'focused' ) { 
				this.focused( true )
				this.set_focused_or_hovered( { focused: true } )
				this.add_to_focus_history( this.dom_id() )
				this.on_focus()
			} else {
				this.focused( false )
				this.set_focused_or_hovered( { focused: false } )
				this.on_blur()
			}
			return next || "blurred"
		}

		async focus( pos: 'start' | 'end' = 'end', ignoreDefault = false ): Promise<void> {
			if ( $mol_mem_cached( ()=> this.focus_state() )  != 'focused' ) this.focus_state( 'setting' )
			const dom = this.dom_tree()
			// wait until dom_node appended
			if( 
				dom?.parentElement?.innerText.trim().replace("\u200B", '') == this.value_changed().trim().replace("\u200B", '')
				|| dom.parentElement && !this.value_changed() 
			) {
				const selection = window.getSelection()!
				const range = document.createRange()
				selection.removeAllRanges()
				if ( pos == 'start' ) {
					range.setEnd( dom, 0 )
					range.collapse( false )
					selection.addRange( range )
					// this.focus_state( 'focused' )
					return
				}
				let focusEl = dom.lastChild!
				if( ! focusEl ) focusEl = dom
				if( focusEl?.nodeName == 'BR' ) {
					if ( focusEl.previousSibling ) {
						focusEl = focusEl.previousSibling //fix firefox, for chrome isn't need
					} else {
						focusEl = focusEl.parentElement! //when block has only one child - br
					}
				}
				range.setEnd( focusEl, focusEl.textContent!.length )
				range.collapse( false )
				selection.addRange( range )
				// this.focus_state( 'focused' )
				return
			}
			else {
				if ( this.value_changed() == 'default_block_value_changed' && ! ignoreDefault ) return //note
				return new Promise( resolve => requestAnimationFrame( () => {
					resolve( this.focus( pos, ignoreDefault ) )
				} ) )
			}
		}

		beforeinput( e?: InputEvent ) {
			const el = $ss_blocks_block_anchor_el()
			if (el.parentElement != focus_el().parentElement) {
			  e?.preventDefault()
			  return
			}

			this.before_any_input( e )
			
			const sel = document.getSelection()!
			switch( e?.inputType ) {

				case 'insertParagraph':
					break

				case 'insertText':
					this.before_insert_text( e )
					break

				case 'deleteContentBackward':
				case 'deleteWordBackward': {
					if( (sel.focusOffset == 1) && sel.isCollapsed && el.textContent?.length == 1 ) {
						e.preventDefault()
						this.value_changed('\u200B')
					}
					// 1 - because first is always zeroWidth
					// if( (sel.focusOffset == 0 || sel.focusOffset == 1) && sel.isCollapsed ) {
					if( (sel.focusOffset == 0 ) && sel.isCollapsed ) {
					// if( sel.focusOffset == 0 && sel.isCollapsed ) {
						//block must be first child in parent (otherwise it won't work)
						if( sel.anchorNode == el.firstChild || sel.anchorNode == el ) {
							e.preventDefault()
							this.delete_backward( e )
						}
					}
					if( el?.textContent == '' || el?.innerText == '\n' ) {
						e.preventDefault()
						// removing.set(true);
					}
					break
				}

				case 'deleteContentForward':
				case 'deleteWordForward': {
					if( el?.parentElement?.innerText == '' || el?.parentElement?.innerText == '\n' ) {
						e.preventDefault()
						// removing.set( true )
						return
					}
					//br may exist, may not
					if( sel?.isCollapsed ) {
						if( sel.focusOffset == sel.anchorNode?.textContent?.length ) {
							if( sel.anchorNode == el.lastChild?.previousSibling )
								e.preventDefault()
							//el.lastChild.previousSibling(?) - because when there is only one line then previousSibling=null
							//== 'BR' - it should be only br, if not - there is text, and shouldn't preventDefault!
							//sel.anchorNode == el.lastChild.previousSibling?.previousSibling - beacause first previous it's br, and second previous it's focused textNode
							if( el.lastChild?.previousSibling?.nodeName == 'BR' && sel.anchorNode == el.lastChild.previousSibling?.previousSibling )
								e.preventDefault() //it's should consider that last el may be text... a may be not!
							if( sel.anchorNode == el.lastChild )
								e.preventDefault()
						}
						//sel.anchorNode - div, caret in empty line
						if( sel.anchorNode?.nodeType != 3 && ( sel.focusOffset >= sel.anchorNode!.childNodes.length - 2 ) ) {
							e.preventDefault()
						}
						//empty line and it is last
						if( sel.anchorNode?.textContent == '\n' && sel.anchorNode == el.lastChild ) {
							e.preventDefault()
						}
					}
					break
				}

			}

			if( e !== undefined ) return e as never
			return null as any
		}

		on_ctrl_x( e?: any ) {
		}

		custom_keydown( e: KeyboardEvent ) {
		}

		keydown( e: KeyboardEvent ) {
			this.custom_keydown( e )

			if( e.key == 'Tab' ) {
				e.preventDefault()

			} else if( e.key === 'Enter' ) {
				const keydown_enter = this.keydown_enter( e )
				if ( keydown_enter !== true ) {
					document.execCommand( 'insertLineBreak' )
				}
				e.preventDefault()

			} else if( e.key === 'ArrowRight' ) {
				this.on_arrow_right( e )

			} else if( e.key === 'ArrowUp' ) {
				this.on_arrow_up( e )

			} else if( e.key === 'ArrowLeft' ) {
				this.on_arrow_left( e )

			} else if( e.key === 'ArrowDown' ) {
				this.on_arrow_down( e )

			} else if( e.ctrlKey ) {

				if( e.code == "KeyX" ) {
					this.on_ctrl_x( e )

				} else if (e.code == "KeyB") {
					e.preventDefault()

				} else if (e.code == "KeyI") {
					e.preventDefault()

				} else if (e.code == "KeyU") {
					e.preventDefault()
				}

			}
			if( e !== undefined ) return e as never
			return null as any
		}

		dragenter(e: any) {
			e.preventDefault()
		}

		drop(e: any) {
			e.preventDefault()
		}

		drag(e: any) {
			e.preventDefault()
		}

		dragleave(e: any) {
			e.preventDefault()
		}

		insert_in_sel( str: string, collapse_to_start = false ){
			const sel = document.getSelection()
			if( sel?.rangeCount ) {
				const range = sel.getRangeAt( 0 )
				const lines = str.split( '\n' )
				range.deleteContents()
				let wasThereTextLineAlready = false
				lines.forEach( ( line: string, index: number ) => {
					if( line == '' || line == '\r' ) {
						range.insertNode( document.createElement( 'br' ) )
						range.collapse( collapse_to_start )
					} else {
						if( wasThereTextLineAlready ) {
							range.insertNode( document.createElement( 'br' ) )
							range.collapse( collapse_to_start )
						}
						range.insertNode( document.createTextNode( line ) )
						range.collapse( collapse_to_start )
						wasThereTextLineAlready = true
					}
				} )
			}

			const innerText = this.dom_node()?.parentElement?.innerText
			this.value_changed( innerText )
		}

		paste(e: any) {
			e.preventDefault()
			
			this.before_any_input( e )

			const data = e.clipboardData.getData( 'text/plain' )
			this.insert_in_sel( data )

			const innerText = this.dom_node()?.parentElement?.innerText
			this.value_changed( innerText )
		}

		cut(e: any) {
		}

		mouseover() {
			this.hovered( true )
			this.set_focused_or_hovered( { hovered: true } )
		}

		mouseout() {
			this.hovered( false )
			this.set_focused_or_hovered( { hovered: false } )
		}

		@ $mol_mem
		hovered( next?: any ): boolean {
			$mol_wire_solid()
			return next
		}
		@ $mol_mem
		focused( next?: any ): boolean {
			$mol_wire_solid()
			return next
		}

	}
	

}
