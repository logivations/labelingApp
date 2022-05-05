/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/

import React, { useCallback, useEffect, useState } from 'react';
import api from '../api/Communicator';
import { View } from 'react-native';
import debounce from 'lodash/debounce';
import uniqBy from 'lodash/uniqBy';
import { Colors } from './styles';
import DropDownPicker from 'react-native-dropdown-picker';

interface IInfiniteDropDownProps {
	defaultOpen?: boolean;
	defaultValue?: string;
	setValue: Function;
}

interface IProduct {
	label: string;
	value: number;

	[key: string]: any;
}

const InfiniteDropDown: React.FC<IInfiniteDropDownProps> = ({ defaultOpen, defaultValue, setValue }) => {
	const [data, setData] = useState<IProduct[]>([]);
	const [limit, setLimit] = useState<number>(300);
	const [offset, setOffset] = useState<number>(0);
	const [productName, setProductName] = useState<string>('');
	const [description, setDescription] = useState<string>('');

	const [loading, setLoading] = useState<boolean>(true);

	const [open, setOpen] = useState<boolean>(defaultOpen || false);
	const [selectedItem, setSelectedItem] = useState<string>(defaultValue || '');

	const fetchData = useCallback(
		async (clearOldData: boolean = false, defaultOffset?: number) => {
			setLoading(true);
			const filterOffset = defaultOffset === undefined ? offset : defaultOffset;
			const result = await api.getFilteredProductsWithOffset(filterOffset, limit, productName, description);
			const newProducts = result.products.map((product: any) => ({
				label: product.name,
				value: product.productId,
				uniqKey: `${product.productId}`,
				...product,
			}));
			setData((prevProducts: IProduct[]) => {
				if (clearOldData) {
					return newProducts;
				}
				return uniqBy([...prevProducts, ...newProducts], 'productId');
			});
			setTimeout(() => setLoading(false), 1000);
		},
		[offset, limit, productName, description],
	);

	const handleEnd = debounce(
		() => fetchData(false, offset + limit).then(() => setOffset((prevOffset) => prevOffset + limit)),
		1000,
		{ leading: true },
	);

	const handleSearch = useCallback(async () => {
		setOffset(0);
		await fetchData(true, 0);
	}, [productName]);

	useEffect(() => {
		(async () => await fetchData(true))();
	}, []);

	useEffect(() => {
		setValue(data.find(({ productId }) => productId === selectedItem));
	}, [selectedItem]);
	return (
		<View style={{ width: '100%' }}>
			<DropDownPicker
				open={open}
				value={selectedItem}
				items={data}
				setOpen={setOpen}
				setValue={setSelectedItem}
				loading={loading}
				searchTextInputProps={{
					value: productName,
					onEndEditing: () => handleSearch(),
					onChangeText: (text) => setProductName(text),
				}}
				searchable={true}
				// @ts-ignore
				flatListProps={{
					keyExtractor: (item: any) => item.uniqKey,
					onEndReached: () => handleEnd(),
					onEndReachedThreshold: 0,
				}}
				dropDownContainerStyle={{ borderColor: Colors.secondary }}
				searchContainerStyle={{
					borderColor: Colors.secondary,
					borderBottomColor: Colors.secondary,
					borderLeftColor: Colors.secondary,
				}}
				customItemContainerStyle={{ borderColor: Colors.secondary, zIndex: 1000000 }}
				searchTextInputStyle={{ borderColor: Colors.secondary, borderRadius: 4, height: 38 }}
				containerStyle={{ borderColor: Colors.secondary, zIndex: 1000000 }}
				style={{ borderColor: Colors.secondary, height: 38, zIndex: 1000000, borderRadius: 4 }}
				modalContentContainerStyle={{ borderRadius: 4, paddingLeft: 4, paddingRight: 4 }}
				closeIconStyle={{ width: 24, height: 24 }}
				listMode={'MODAL'}
			/>
		</View>
	);
};

export default InfiniteDropDown;
