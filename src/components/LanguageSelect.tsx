import React from 'react';
import i18next from 'i18next';
import { FlagButton, FlagWrapper, LanguageContainer } from './styles';
// @ts-ignore
import EnglandFlag from '../../assets/icons/english-flag.svg';
// @ts-ignore
import GermanFlag from '../../assets/icons/german-flag.svg';
import useAppContext from '../context/AppContext';

const LanguageSelect = () => {
	const { activeLanguage } = useAppContext();

	return (
		<LanguageContainer>
			<FlagButton isActive={activeLanguage === 'en'} onPress={() => i18next.changeLanguage('en')}>
				<FlagWrapper>
					<EnglandFlag />
				</FlagWrapper>
			</FlagButton>
			<FlagButton isActive={activeLanguage === 'de'} onPress={() => i18next.changeLanguage('de')}>
				<FlagWrapper>
					<GermanFlag />
				</FlagWrapper>
			</FlagButton>
		</LanguageContainer>
	);
};

export default LanguageSelect;
