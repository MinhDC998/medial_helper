import React from 'react';
import ReactDOM from 'react-dom/client';

import { RouterProvider } from 'react-router-dom';

import routers from '@routers/routers';
import './index.scss';

const root = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(root).render(<RouterProvider router={routers} />);
