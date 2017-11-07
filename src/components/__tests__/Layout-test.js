import {Section, Numeric, Panel, Fold} from '..';
import NumericInput from '../widgets/NumericInputStatefulWrapper';
import React from 'react';
import {EDITOR_ACTIONS} from '../../constants';
import {TestEditor, fixtures, plotly} from '../../lib/test-utils';
import {connectLayoutToPlot} from '../../lib';
import {mount} from 'enzyme';

const Layouts = [Panel, Fold, Section].map(connectLayoutToPlot);
const Editor = props => (
  <TestEditor {...{plotly, onUpdate: jest.fn(), ...props}} />
);

Layouts.forEach(Layout => {
  describe(`<${Layout.displayName}>`, () => {
    it(`wraps container with fullValue pointing to gd._fullLayout`, () => {
      const wrapper = mount(
        <Editor {...fixtures.scatter({layout: {width: 100}})}>
          <Layout>
            <Numeric label="Width" min={100} step={10} attr="width" />
          </Layout>
        </Editor>
      )
        .find('[attr="width"]')
        .find(NumericInput);

      expect(wrapper.prop('value')).toBe(100);
    });

    it(`sends updates to gd._layout`, () => {
      const onUpdate = jest.fn();
      const wrapper = mount(
        <Editor
          onUpdate={onUpdate}
          {...fixtures.scatter({layout: {width: 100}})}
        >
          <Layout>
            <Numeric label="Width" min={100} step={10} attr="width" />
          </Layout>
        </Editor>
      )
        .find('[attr="width"]')
        .find(NumericInput);

      wrapper.prop('onChange')(200);
      const event = onUpdate.mock.calls[0][0];
      expect(event.type).toBe(EDITOR_ACTIONS.UPDATE_LAYOUT);
      expect(event.payload).toEqual({update: {width: 200}});
    });
  });
});
