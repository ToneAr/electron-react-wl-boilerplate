import React from 'react';

const SvgMock = React.forwardRef((props, ref) => (
	// eslint-disable-next-line react/jsx-props-no-spreading
	<span ref={ref} {...props} />
));

export const ReactComponent = SvgMock;
export default 'test-file-stub';
