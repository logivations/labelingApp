/*******************************************************************************
 * (C) Copyright
 * Logivations GmbH, Munich 2010-2021
 ******************************************************************************/
import React from 'react';
import { ButtonText, InnerContainer, StyledButton, StyledContainer } from '../components/styles';
import Communicator from '../api/Communicator';
import useAppContext from '../AppContext';

const Welcome = () => {
	const { checkIsSignedIn } = useAppContext();

	return (<StyledContainer>
		<InnerContainer>
			<StyledButton onPress={async () => {
				await Communicator.logout();
				checkIsSignedIn();
			}}>
				<ButtonText>Logout</ButtonText>
			</StyledButton>
		</InnerContainer>
	</StyledContainer>);
};

export default Welcome;