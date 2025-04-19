import React, { FC, Suspense } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import StoreState from 'model/store';
import { LoginForm } from '../Form/LoginForm';
import SocialForm from '../Form/SocialForm';
import classes from '../Modal/loginModal.module.scss';
import ModalLoginLoading from '../Form/ModalLoginLoading';

const LoginFullScreen: FC = () => {
  // const { token, loggingIn } = useSelector((state: StoreState) => state.authenticate);
  // const { replace, query } = useRouter();

  // useEffect(() => {
  //   if (token && !loggingIn && !query.redirecting) {
  //     // replace({ pathname: '/' });
  //   }
  // }, [token, replace, loggingIn, query.redirecting]);
  const loading = useSelector((store: StoreState) => store.authenticate.loading);
  return (
    <div className={classes.loginFullScreen}>
      <div
        className={classes.content}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
        }}>
        <div>
          <h2 style={{ marginBottom: 30 }}>Welcome Back</h2>
          <LoginForm />
          <div style={{ padding: '50px 0px' }}>
            <SocialForm />
          </div>
        </div>
        <div>
          <div className={classes.registerText}>
            Don’t have an account?{' '}
            <Link href={'/register'}>
              <a className={classes.link}>Sign up</a>
            </Link>
            .
          </div>
          <div className={classes.forgotPasswordText}>
            <Link href={'/forgot-password'}>
              <a className={classes.link}>Forgot password?</a>
            </Link>
          </div>
        </div>
      </div>
      {loading && (
        <Suspense fallback={null}>
          <ModalLoginLoading isOpen={loading} />
        </Suspense>
      )}
    </div>
  );
};
export default LoginFullScreen;
