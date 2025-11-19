import { Component } from 'solid-js';
import styles from "./Downloads.module.scss";
import { wallets as t } from "../translations";
import PageTitle from "../components/PageTitle/PageTitle";
import PageCaption from "../components/PageCaption/PageCaption";
import { useIntl } from "@cookbook/solid-intl";


const Wallet: Component = () => {
  const intl = useIntl();
  return (
    <div class={styles.downloadsContainer} >
      <PageTitle title={intl.formatMessage(t.title)} />
      <PageCaption title={intl.formatMessage(t.title)} />
      
    </div>
  );
}

export default Wallet;
