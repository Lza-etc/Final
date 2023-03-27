

export async function getPaths(x = 'CS_109', y='CS_302'){
	const neo4j = require('neo4j-driver')
	
	const user = 'neo4j';

	const uri = 'neo4j+s://74dcf11f.databases.neo4j.io';
	const password = 'alF_xF6xIkhafvcwbhuwj30k1YLTYKMizRFin7WkMo0';

	const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))

	const session = driver.session()
   
	const node1Name = x
	const node2Name = y
   
	let result = [];

	try {
		const readQuery = `match (p1:room {id: '${node1Name}' }), (p2:room {id: '${node2Name}'}), path = shortestPath((p1)-[*..15]-(p2)) return path`
		// const readQuery = `match (p1:room {id: 'CS_108' }), (p2:room {id: 'CS_304'}), path = shortestPath((p1)-[*..15]-(p2)) return path`
		const readResult = await session.readTransaction(tx =>
			// tx.run(readQuery, { room1Name: node1Name, room2Name: node2Name })
			tx.run(readQuery)
		)
		// console.log(readResult)
		var record_set = []
		readResult.records.map(record => {
			// console.log(record)
			var list = []
			var segments = record["_fields"][0]["segments"];
			segments.forEach(element => {
				// console.log(element)
				list.push(element.start.properties.id)
			});
			list.push(record._fields[0].end.properties.id)
			// console.log(list)
			record_set.push(list )
			// console.log(`Found point: `)
			// console.log(JSON.stringify(record)); 
		})
	  	// let unique = [...new Set(record_set)];
		// console.log(record_set[0])
		result = record_set[0]
		// console.log(unique)

	} catch (error) {
	  console.error('Something went wrong: ', error)
	} finally {
	  await session.close()
	}
   
	// Don't forget to close the driver connection when you're finished with it
	await driver.close()
	return(result)

};


