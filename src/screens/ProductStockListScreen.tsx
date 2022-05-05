/*******************************************************************************
 *  (C) Copyright
 *  Logivations GmbH, Munich 2010-2021
 ******************************************************************************/
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
	ButtonGroup,
	ButtonText,
	Colors,
	ErrorMsgBox,
	InnerContainer,
	StyledButton,
	StyledContainer,
} from '../components/styles';
// @ts-ignore
import useAppContext from '../context/AppContext';
import RouteNames from '../constants/route.names';
import Communicator from '../api/Communicator';
// @ts-ignore
import { Toast } from 'popup-ui';
import { DeviceEventEmitter } from 'react-native';
import StockLevelList from '../components/StockLevelListItem';

export interface IStock {
	quantity: number;
	rackId: number;
	binId: number;
	productId: number;
}

// @ts-ignore
const ProductStockListScreen = ({ navigation, route }) => {
	const { t } = useAppContext();

	const [stockList, setStockList] = useState<IStock[]>([]);
	const [productId, setProductId] = useState<number>(0);

	const eanCode = useMemo(() => route.params.ean, [route.params]);

	const refreshStock = useCallback(async () => {
		try {
			const productIds = await Communicator.getProductIdsByEanCode(eanCode);
			const stockSummary = await Communicator.getStockSummaryByEanGroupedByRackBin(eanCode);
			setProductId(Array.isArray(productIds) ? productIds[0] : 0);
			setStockList(stockSummary);
		} catch (error) {
			Toast.show({ title: error.message, color: Colors.green, timing: 5000 });
		}
	}, [eanCode]);

	useEffect(() => {
		const listener = DeviceEventEmitter.addListener('refreshStock', async () => {
			await refreshStock();
		});
		return () => {
			listener && listener.remove();
		};
	}, []);

	useEffect(() => {
		refreshStock();
	}, [eanCode]);

	return (
		<StyledContainer headerExist={true}>
			<InnerContainer>
				<ButtonGroup>
					<StyledButton
						onPress={() => navigation.navigate(RouteNames.CREATE_STOCK_RECORD, { productId })}
						disabled={false}
						minWidth={'100%'}
						lastButton={true}
					>
						<ButtonText>{t('CREATE_STOCK_RECORD')}</ButtonText>
					</StyledButton>
				</ButtonGroup>
				{!stockList.length ? (
					<ErrorMsgBox>{t('NO_STOCK_FOR_CHOSEN_PRODUCT')}</ErrorMsgBox>
				) : (
					<StockLevelList stockList={stockList} />
				)}
			</InnerContainer>
		</StyledContainer>
	);
};

export default ProductStockListScreen;
