import { Pie } from '@nivo/pie';
import { Box } from '@rocket.chat/fuselage';
import colors from '@rocket.chat/fuselage-tokens/colors';
import React, { useMemo, useCallback } from 'react';

const graphColors = (color) => ({ used: color || colors.b500, free: colors.n300 });

const UsageGraph = ({ used = 0, total = 0, label, color, size }) => {
	const parsedData = useMemo(
		() => [
			{
				id: 'used',
				label: 'used',
				value: used,
			},
			{
				id: 'free',
				label: 'free',
				value: total - used,
			},
		],
		[total, used],
	);

	const getColor = useCallback((data) => graphColors(color)[data.id], [color]);

	const unlimited = total === 0;

	return (
		<Box display='flex' flexDirection='column' alignItems='center'>
			<Box size={`x${size}`}>
				<Box position='relative'>
					<Pie
						data={parsedData}
						margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
						innerRadius={0.8}
						colors={getColor}
						width={size}
						height={size}
						enableSlicesLabels={false}
						enableRadialLabels={false}
					/>
					<Box
						display='flex'
						alignItems='center'
						justifyContent='center'
						position='absolute'
						color={color}
						fontScale='p2'
						style={{ left: 0, right: 0, top: 0, bottom: 0 }}
					>
						{unlimited ? '∞' : `${Number((100 / total) * used).toFixed(2)}%`}
					</Box>
				</Box>
			</Box>
			<span>
				<Box is='span' color='default'>
					{used}
				</Box>{' '}
				/ {unlimited ? '∞' : total}
			</span>
			<span>{label}</span>
		</Box>
	);
};

export default UsageGraph;
