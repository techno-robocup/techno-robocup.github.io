# Install docker
```bash
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

# Execute this command when needed to add yourself to docker group
```bash
sudo gpasswd -a $USER docker
```

# Start server
```bash
docker compose up
```
End it with ctrl+c

OR

```bash
docker compose up -d
```
End it with
```bash
docker compose down
```