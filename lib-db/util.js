export async function createUser(userData) {
    const response = await fetch('/api/auth/signup', {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error({ message: 'Error' })
    }
    console.log(data)
    return data;
}