import LabelDatabase from './LabelDatabase'

test('can load the fixture labels.csv', async () => {
  const db = new LabelDatabase('fixtures', 'fixtures/labels.csv', 'safe')
  await db.loadLabels()
})
