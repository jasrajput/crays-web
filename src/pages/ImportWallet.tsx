import { Component, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import styles from "./ImportWallet.module.scss";
import { validateMnemonic } from 'bip39';

const ImportWallet: Component = () => {
  const navigate = useNavigate();
  
  const [mnemonicInput, setMnemonicInput] = createSignal("");
  const [error, setError] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);

  const handleInputChange = (value: string) => {
    setMnemonicInput(value);
    setError("");
  };

  const validateAndImport = async () => {
    const mnemonic = mnemonicInput().trim();
    
    if (!mnemonic) {
      setError("Please enter your recovery phrase");
      return;
    }

    // Normalize whitespace and validate word count
    const words = mnemonic.split(/\s+/);
    
    if (words.length !== 12 && words.length !== 24) {
      setError("Recovery phrase must be 12 or 24 words");
      return;
    }

    // Join with single spaces for validation
    const normalizedMnemonic = words.join(" ");

    // Validate using BIP39
    if (!validateMnemonic(normalizedMnemonic)) {
      setError("Invalid recovery phrase. Please check your words and try again.");
      return;
    }

    setIsLoading(true);
    
    try {
      // Navigate to success page with mnemonic
      navigate("/wallet/success", { 
        state: { 
          isImport: true,
          mnemonic: normalizedMnemonic
        } 
      });
    } catch (err) {
      console.error("Failed to import wallet:", err);
      setError("Failed to import wallet. Please try again.");
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMnemonicInput("");
    setError("");
  };

  const wordCount = () => {
    const words = mnemonicInput().trim().split(/\s+/).filter(w => w.length > 0);
    return words.length;
  };

  return (
    <div class={styles.importContainer}>
      <div class={styles.header}>
        <button class={styles.backButton} onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="currentColor"/>
          </svg>
        </button>
        <h1 class={styles.title}>Import Wallet</h1>
      </div>

      <div class={styles.content}>
        <div class={styles.infoCard}>
          <svg class={styles.infoIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z" fill="currentColor"/>
          </svg>
          <div class={styles.infoContent}>
            <h3>Restore Your Wallet</h3>
            <p>
              Enter or paste your 12 or 24-word recovery phrase to restore your wallet. 
              Make sure you're in a private place and no one can see your screen.
            </p>
          </div>
        </div>

        {error() && (
          <div class={styles.errorBanner}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
            </svg>
            <p>{error()}</p>
          </div>
        )}

        <div class={styles.phraseSection}>
          <div class={styles.phraseHeader}>
            <h3>Recovery Phrase</h3>
            <div class={styles.wordCounter}>
              <span class={wordCount() === 12 || wordCount() === 24 ? styles.valid : ""}>
                {wordCount()} words
              </span>
            </div>
          </div>

          <textarea
            class={styles.mnemonicTextarea}
            placeholder="Enter your recovery phrase here (12 or 24 words)"
            value={mnemonicInput()}
            onInput={(e) => handleInputChange(e.currentTarget.value)}
            rows={4}
            autocomplete="off"
            spellcheck={false}
          />

          <div class={styles.actionButtons}>
            <button 
              class={styles.clearButton} 
              onClick={handleClear}
              disabled={!mnemonicInput()}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
              </svg>
              Clear
            </button>
          </div>
        </div>

        <button 
          class={styles.importButton}
          onClick={validateAndImport}
          disabled={!mnemonicInput().trim() || isLoading()}
        >
          {isLoading() ? (
            <>
              <div class={styles.spinner}></div>
              Importing Wallet...
            </>
          ) : (
            <>
              Import Wallet
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16V10H5L12 3L19 10H15V16H9ZM5 20V18H19V20H5Z" fill="currentColor"/>
              </svg>
            </>
          )}
        </button>

        <div class={styles.securityWarning}>
          <h4>⚠️ Security Warning</h4>
          <ul>
            <li>Never share your recovery phrase with anyone</li>
            <li>Breez support will never ask for your recovery phrase</li>
            <li>Be aware of phishing attempts and fake websites</li>
            <li>Store your phrase securely offline after import</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImportWallet;
