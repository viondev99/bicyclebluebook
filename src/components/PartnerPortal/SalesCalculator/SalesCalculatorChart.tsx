/* eslint-disable no-shadow */
import Card from '@ui/Cards';
import cx from 'classnames';
import React, { FC, useCallback } from 'react';
import { formatNumber } from 'helpers/string.helper';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import classes from './sales-calculator-chart.module.scss';

const data = [
  {
    name: 'Jan',
    value: 3500,
  },
  {
    name: 'Feb',
    value: 3800,
  },
  {
    name: 'Mar',
    value: 4500,
  },
  {
    name: 'Apr',
    value: 5000,
  },
  {
    name: 'May',
    value: 4800,
  },
  {
    name: 'Jun',
    value: 4500,
  },
  {
    name: 'Jul',
    value: 4000,
  },
  {
    name: 'Aug',
    value: 4200,
  },
  {
    name: 'Sep',
    value: 4300,
  },
  {
    name: 'Oct',
    value: 4400,
  },
  {
    name: 'Nov',
    value: 4500,
  },
  {
    name: 'Dec',
    value: 4600,
  },
];

const SalesCalculatorChart: FC = () => {
  const CustomizedActiveDot = (props: { cx: number; cy: number; value: number }) => {
    const { cx, cy } = props;

    return (
      <svg
        x={cx - 30}
        y={cy - 18}
        width={60}
        height={60}
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_11659_94673)">
          <circle cx="30" cy="18" r="8" fill="#4CB3E4" />
          <circle cx="30" cy="18" r="7" stroke="#4CB3E4" strokeWidth="2" />
        </g>
        <defs>
          <filter
            id="filter0_d_11659_94673"
            x="0"
            y="0"
            width="60"
            height="60"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="12" />
            <feGaussianBlur stdDeviation="11" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.109804 0 0 0 0 0.247059 0 0 0 0 0.309804 0 0 0 0.45 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_11659_94673" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_11659_94673" result="shape" />
          </filter>
        </defs>
      </svg>
    );
  };

  const CustomizedDot = (props: { cx: number; cy: number; value: number }) => {
    const { cx, cy } = props;

    return (
      <svg
        x={cx - 21}
        y={cy - 12}
        width={42}
        height={42}
        viewBox="0 0 42 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_11659_94949)">
          <circle cx="20.9544" cy="12.0843" r="3.73665" fill="white" />
          <circle cx="20.9544" cy="12.0843" r="2.98932" stroke="#4CB3E4" strokeWidth="1.49466" />
        </g>
        <defs>
          <filter
            id="filter0_d_11659_94949"
            x="0.776493"
            y="0.874348"
            width="40.3562"
            height="40.3552"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="8.96797" />
            <feGaussianBlur stdDeviation="8.22064" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.109804 0 0 0 0 0.247059 0 0 0 0 0.309804 0 0 0 0.45 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_11659_94949" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_11659_94949" result="shape" />
          </filter>
        </defs>
      </svg>
    );
  };

  const renderCustomTooltip = useCallback(({ payload }) => {
    return <div className={classes.wrapTooltip}>${payload?.length ? formatNumber(payload[0]?.value) : 0}</div>;
  }, []);

  return (
    <Card className={classes.customCard}>
      <div className={cx(classes.headerText, classes.wrapGeneralHeader)}>Additional Store Revenue Opportunity</div>
      <div className={classes.description}>
        Average <span>$3,250 / month</span>
      </div>

      <div className={classes.wrapChart}>
        <ResponsiveContainer width={`100%`} height={300}>
          <AreaChart
            width={500}
            height={400}
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}>
            <XAxis dataKey="name" stroke="#C8CACD" tickLine={false} />
            <YAxis stroke="#C8CACD" tickLine={false} axisLine={false} />
            <Tooltip active={false} viewBox={{ x: 0, y: 0, width: 400, height: 400 }} content={renderCustomTooltip} />
            <defs>
              <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4cb3e4" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4cb3e4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke="#4cb3e4"
              fill="url(#colorPv)"
              fillOpacity={1}
              activeDot={<CustomizedActiveDot cx={0} cy={0} value={0} />}
              dot={<CustomizedDot cx={0} cy={0} value={0} />}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default SalesCalculatorChart;
