import React, { useState, FormEvent } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { generatePassword } from '@password-generator/package';

import ClipboardIcon from '../../clipboard-icon.png';
import {
  Container,
  Title,
  ResultContainer,
  ResultSpan,
  ResultCopyToClipboardButton,
  Setting,
  PasswordLengthInput,
  GeneratePasswordButton,
  DefaultInitialTextInput,
  CheckBox,
} from './styles';

const PasswordGeneratorMain: React.FC = () => {
  const [password, setPassword] = useState('');
  const [passwordLength, setPasswordLength] = useState(6);
  const [pronounceable, setPronounceable] = useState(false);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(false);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [cachedSettings, setCachedSettings] = useState({
    uppercase: true,
    lowercase: false,
    numbers: true,
    symbols: false,
  });
  const [initialText, setInitialText] = useState('');

  const handleCopyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      toast.success('Password was copied to your clipboard');
    }
  };

  const handleToogleGeneratePronunceablePassword = () => {
    if (pronounceable === false) {
      setCachedSettings({
        uppercase,
        lowercase,
        numbers,
        symbols,
      });
      setUppercase(false);
      setLowercase(false);
      setNumbers(false);
      setSymbols(false);
      setPronounceable(true);
    } else {
      setUppercase(cachedSettings.uppercase);
      setLowercase(cachedSettings.lowercase);
      setNumbers(cachedSettings.numbers);
      setSymbols(cachedSettings.symbols);
      setPronounceable(false);
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      const passwordGenerated = generatePassword({
        length: passwordLength,
        initialText,
        useChars: {
          pronounceable,
          uppercase,
          lowercase,
          symbols,
          numbers,
        },
      });
      if (passwordGenerated === null) return;
      setPassword(passwordGenerated);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Container onSubmit={handleFormSubmit}>
      <Title>Password Generator</Title>

      <ResultContainer>
        <ResultSpan data-test-id="resultSpan" value={password} readOnly />
        <ResultCopyToClipboardButton
          data-test-id="clipboard"
          onClick={handleCopyToClipboard}
        >
          <img src={ClipboardIcon} alt="Copy" width={40} height={40} />
        </ResultCopyToClipboardButton>
      </ResultContainer>

      <div>
        <Setting>
          <label>Password Length</label>
          <PasswordLengthInput
            data-test-id="passwordLengthInput"
            value={passwordLength}
            onChange={(e) => setPasswordLength(Number(e.target.value))}
          />
        </Setting>

        <Setting>
          <label>Add Initial Text</label>
          <DefaultInitialTextInput
            data-test-id="defaultInitialTextInput"
            value={initialText}
            onChange={(e) => setInitialText(e.target.value)}
          />
        </Setting>

        <Setting>
          <label>Pronounceable Password</label>
          <CheckBox
            data-test-id="pronounceable"
            checked={pronounceable}
            onChange={handleToogleGeneratePronunceablePassword}
          />
        </Setting>

        <Setting>
          <label>Include Uppercase Letters</label>
          <CheckBox
            data-test-id="uppercase"
            checked={uppercase}
            onChange={() => setUppercase(!uppercase)}
            disabled={pronounceable}
          />
        </Setting>

        <Setting>
          <label>Include Lowercase Letters</label>
          <CheckBox
            data-test-id="lowercase"
            checked={lowercase}
            onChange={() => setLowercase(!lowercase)}
            disabled={pronounceable}
          />
        </Setting>

        <Setting>
          <label>Include Numbers</label>
          <CheckBox
            data-test-id="numbers"
            checked={numbers}
            onChange={() => setNumbers(!numbers)}
            disabled={pronounceable}
          />
        </Setting>

        <Setting>
          <label>Include Symbols</label>
          <CheckBox
            data-test-id="symbols"
            checked={symbols}
            onChange={() => setSymbols(!symbols)}
            disabled={pronounceable}
          />
        </Setting>
      </div>

      <GeneratePasswordButton
        type="submit"
        data-test-id="generatePasswordButton"
      >
        Generated Password
      </GeneratePasswordButton>
      <ToastContainer />
    </Container>
  );
};

export default PasswordGeneratorMain;
