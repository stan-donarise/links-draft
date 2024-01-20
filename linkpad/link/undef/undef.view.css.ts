namespace $.$$ {

	$mol_style_define( $ss_linkpad_link_undef, {
		Insert_row: {
			position: 'absolute',
			width: '100%',
			justifyContent: 'center',
			gap: $mol_gap.space,
			pointerEvents: 'none',
		},
		Autocomplete_bubble_content: {
			flex: {
				shrink: 1,
			},
		},
		Anchor: {
			width: 'fit-content',
			gap: $mol_gap.block,
			flex: {
				shrink: 1,
				grow: 1,
			},
			alignItems: 'flex-start',
		},
		Label: {
			position: 'relative',
			justifyContent: 'space-between',
		}
	})
	
}
